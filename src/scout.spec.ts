import {Scout} from './scout';

describe('Scout', () => {
  let scout: Scout;
  const testHtml = `
<html>
  <body>
    <h1>Hello World</h1>
    <h2>From my room</h2>
    <p>Rise up this morning</p>
    <p>Smile with the rising sun </p>
    <footer>The end </footer>
  </body>
</html>
`;

  beforeAll(async () => {
    scout = await Scout.create(testHtml);
  });

  test('Can create a scout', () => {
    expect(scout).toBeTruthy();
  });

  describe('using exact match', () => {
    test('Can find text on page', () => {
      expect(scout.find('Hello World')).toBe(true);
      expect(scout.find('Blue')).toBe(false);
    });

    test('Can find text under another reference text', () => {
      expect(scout.under('Hello World')).toEqual('From my room');
      expect(scout.under('The end')).toBeUndefined();
    });

    test('Finds text between reference two texts', () => {
      const elms = scout.between('From my room', 'The end');
      expect(elms).toEqual(
          ['Rise up this morning', 'Smile with the rising sun']);
    });
  });


  describe('using regex', () => {
    const textRegex = /^Hello (\w+)$/;

    test('Can find text on page using regex', () => {
      expect(scout.find(textRegex)).toEqual(['Hello World', 'World']);
    });

    test('Can find text under another reference text ', () => {
      expect(scout.under(textRegex)).toEqual('From my room');
    });

    test('Finds text between reference two texts', () => {
      const elms = scout.between(/From my \w+/, /The \w+/);
      expect(elms).toEqual(
          ['Rise up this morning', 'Smile with the rising sun']);
    });
  });
});


describe('Scout with table', () => {
  let scout: Scout;
  const testHtml = `
<html>
  <body>
    <table>
      <th>
        <td>Item</td>
        <td>Price</td>
      </th>
      <tr>
        <td>Book</td>
        <td>$20.22</td>
      </tr>
      <tr> 
        <td>Coffee</td>
        <td>$5.99</td>
      </tr>
    </table>
    <dl>
      <dt>Total</dt>
      <dd>$26.21</dd>
    </dl>
  </body>
</html>
`;

  beforeAll(async () => {
    scout = await Scout.create(testHtml);
  });

  describe('using exact match', () => {
    test('Can get table data', () => {
      expect(scout.rowsBetween('Item', 'Total', 2)).toEqual([
        ['Book', '$20.22'], ['Coffee', '$5.99']
      ]);
    });
  });


  describe('using regex', () => {
    test('Can get table data', () => {
      expect(scout.rowsBetween(/Item/, /Total/, 2)).toEqual([
        ['Book', '$20.22'], ['Coffee', '$5.99']
      ]);
    });
  });
});