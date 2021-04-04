import * as puppeteer from 'puppeteer';

import {isRightOf, isUnder, sortByX, sortByY, TextElement, yMax, yMin} from './text-element';

export type Locator = string|RegExp;

export class Scout {
  private constructor(private data: TextElement[]) {}

  private findElement(locator: Locator): TextElement|undefined {
    if (typeof locator === 'string') {
      return this.data.find(elm => elm.text === locator);
    } else {
      for (const elm of this.data) {
        const results = locator.exec(elm.text);
        if (results) {
          return {...elm, results: [...results]};
        }
      }
    }
  };

  private findByRelation(
      locator: Locator,
      predicate: (ref: TextElement, elm: TextElement) => boolean,
      comparer: (a: TextElement, b: TextElement) => number): string|undefined {
    const refElement = this.findElement(locator);
    const elm = refElement &&
        this.data.filter(e => predicate(refElement, e)).sort(comparer)[0];
    return (elm && elm.text);
  }

  public find(locator: Locator) {
    const elm = this.findElement(locator);
    return (elm && elm.results) || !!elm;
  }

  under(locator: Locator): string|undefined {
    return this.findByRelation(locator, isUnder, sortByY);
  }

  rightOf(locator: Locator): string|undefined {
    return this.findByRelation(locator, isRightOf, sortByX);
  }

  between(top: Locator, bottom: Locator): string[] {
    const topElement = this.findElement(top);
    if (!topElement) {
      return [];
    }
    const bottomElement = this.findElement(bottom);
    if (!bottomElement) {
      return [];
    }
    if (yMax(topElement) > yMin(bottomElement)) {
      return [];
    }
    const elms = this.data.filter(elm => {
      return yMax(topElement) <= yMin(elm) && yMin(bottomElement) >= yMax(elm);
    });
    elms.sort((a, b) => a.boundingBox.y - b.boundingBox.y);
    return elms.map(elm => elm.text);
  }

  rowsBetween(top: Locator, bottom: Locator, numberOfColumns: number):
      string[][] {
    const topElement = this.findElement(top);
    if (!topElement) {
      return [];
    }
    const bottomElement = this.findElement(bottom);
    if (!bottomElement) {
      return [];
    }
    if (yMax(topElement) > yMin(bottomElement)) {
      return [];
    }
    const elms = [...this.data].filter(elm => {
      return yMax(topElement) <= yMin(elm) && yMin(bottomElement) >= yMax(elm);
    });
    elms.sort((a, b) => a.boundingBox.y - b.boundingBox.y);

    const elements = [];

    for (const elm of elms) {
      const results = elm.text.split('\t').map(r => r.trim());
      if (results.length === numberOfColumns) {
        elements.push({...elm, results});
      }
    }
    return elements.map(elm => elm.results);
  }

  public static async create(html: string): Promise<Scout> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    let textContent: TextElement[] = [];
    const body = await page.$('body');

    if (body) {
      textContent = await body.evaluate(elm => {
        function walk(htmlElement: HTMLElement) {
          if (!htmlElement.getBoundingClientRect ||
              typeof htmlElement.getBoundingClientRect !== 'function') {
            return [];
          }
          if (!htmlElement.innerText || htmlElement.innerText.trim() === '') {
            return [];
          }
          const rect = htmlElement.getBoundingClientRect();
          const data = {
            text: htmlElement.innerText.trim(),
            boundingBox:
                {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
          };

          if (htmlElement.hasChildNodes()) {
            const accData: TextElement[] =
                Array.from(htmlElement.childNodes)
                    .map(child => walk(child as HTMLElement))
                    .reduce((acc, val) => acc.concat(val), []);


            if (!accData.some(el => el.text === data.text)) {
              accData.push(data);
            }
            return accData;
          } else {
            return [data];
          }
        }

        return walk(elm as HTMLElement);
      });
    }

    await browser.close();
    return new Scout(textContent);
  }
}
