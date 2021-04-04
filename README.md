# Scout

## Description

Finds text on an HTML  page via relationship to other text on the page. 


## Example Usage


### Find text on page

> Hello World

```typescript
const scout = await Scout.create(testHtml);

 // returns true
const found = scout.find('Hello World');

// returns ['Hello World', 'World']
const foundWithRegex = scout.find(/^Hello (\w+)$/); 
```


### Find text under a reference text

> <h3>Total:<h3/>
> <span>$8.97</span>

```typescript 
const scout = await Scout.create(testHtml);

// returns '$8.97'
const text = scout.under('Total:' /* string or regex */);
```

### Get row text

You can can also use scout to fetch table text

>    <table>
>     <tr>
>       <td>Item</td>
>       <td>Price</td>
>      </tr>
>      <tr>
>        <td>Book</td>
>        <td>$20.22</td>
>      </tr>
>      <tr> 
>        <td>Coffee</td>
>        <td>$5.99</td>
>      </tr>
>      <tr>
>        <td>Total</td>
>        <td>$26.21</td>
>      </tr>
>    </table>

```typescript 
const scout = await Scout.create(testHtml);

// returns [['Book', '$20.22'], ['Coffee', '$5.99']]
const rows = scout.rowsBetween('Item', 'Total', 2);
```
