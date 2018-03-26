

# 💪 Smart Json Templater 👌

## install
`npm i smart-json-templater --save`
## raw.json (Original data / request)
```
{
 store: {
   book: [
     {
       category: 'reference',
       author: 'Nigel Rees',
       title: 'Sayings of the Century',
       price: 8.95,
     }, {
       category: 'fiction',
       author: 'Evelyn Waugh',
       title: 'Sword of Honour',
       price: 12.99,
     }, {
       category: 'fiction',
       author: 'Herman Melville',
       title: 'Moby Dick',
       isbn: '0-553-21311-3',
       price: 8.99,
     }, {
       category: 'fiction',
       author: 'J. R. R. Tolkien',
       title: 'The Lord of the Rings',
       isbn: '0-395-19395-8',
       price: 22.99,
     },
   ],
   address: 'The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ',
 },
}
```
## rules.json (Using JSONPath Syntax)
```
[
  {
    xpath: '$..author', // JSONPath Syntax
    save: 'author', // save the result in this key
  },
  {
    xpath: '$..title', // JSONPath Syntax
    save: 'title', // save the result in this key
  },
  {
    xpath: '$.store.address', // JSONPath Syntax
    save: 'address', // save the result in this key
  },
  {
    xpath: '$.store.book[*].isbn', // JSONPath Syntax
    save: 'isbn', // save the result in this key
  },
  {
    xpath: '$..price',
    save: 'price',
  },
]
```
### JSONPath Syntax

JSONPath         | Description
-----------------|------------
`$`               | The root object/element
`@`                | The current object/element
`.`                | Child member operator
`..`	         | Recursive descendant operator; JSONPath borrows this syntax from E4X
`*`	         | Wildcard matching all objects/elements regardless their names
`\[\]`	         | Subscript operator
`\[,\]`	         | Union operator for alternate names or array indices as a set
`\[start:end:step\]` | Array slice operator borrowed from ES4 / Python
`?()`              | Applies a filter (script) expression via static evaluation
`()`	         | Script expression via static evaluation

Here are syntax and examples [JSONPath.md](https://github.com/kikerios/smart-json-templater/blob/master/JSONPath.md)


## template
```
The template must be a String
const template = '{{~}}' // special key

or a JSON
const template = {
	public: '{{title}} by "{{author}}", only for USD {{price}}',
	library: '{{address}}',
}

```
### Special Keys

Key| Description
-----------------|------------
`{{~}}`               | Attach transformed data
`{{$}}`                | Attach original data / request

## example #1
```
const templater = require('smart-json-templater')

// example data
const template = '{{~}}'
const rules = require('./rules.json')
const raw = require('./raw.json')

templater
	.convert(template, rules, raw)
	.then((result)=>{
			console.log(result)
	})
```
## result #1
```
[
  {
    "author":"Nigel Rees",
    "title":"Sayings of the Century",
    "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
    "isbn":null,
    "price":8.95
  },
  {
    "author":"Evelyn Waugh",
    "title":"Sword of Honour",
    "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
    "isbn":null,
    "price":12.99
  },
  {
    "author":"Herman Melville",
    "title":"Moby Dick",
    "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
    "isbn":"0-553-21311-3",
    "price":8.99
  },
  {
    "author":"J. R. R. Tolkien",
    "title":"The Lord of the Rings",
    "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
    "isbn":"0-395-19395-8",
    "price":22.99
  }
]
```
## example #2
```
const templater = require('smart-json-templater')

// example data
const template = {
	public: '{{title}} by "{{author}}", only for USD {{price}}',
	library: '{{address}}',
}
const rules = require('./rules.json')
const raw = require('./raw.json')

templater
	.convert(template, rules, raw)
	.then((result)=>{
			console.log(result)
	})
```
## result #2
```
[
  {
    "public":"Sayings of the Century by \"Nigel Rees\", only for USD 8.95",
    "library":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. "
  },
  {
    "public":"Sword of Honour by \"Evelyn Waugh\", only for USD 12.99",
    "library":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. "
  },
  {
    "public":"Moby Dick by \"Herman Melville\", only for USD 8.99",
    "library":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. "
  },
  {
    "public":"The Lord of the Rings by \"J. R. R. Tolkien\", only for USD 22.99",
    "library":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. "
  }
]
```
## example #3
```
const templater = require('smart-json-templater')

// example data
const template = {
	type: 'e-book',
	shipping: true,
	available: true,
	information: '{{~}}',
}
const rules = require('./rules.json')
const raw = require('./raw.json')

templater
	.convert(template, rules, raw)
	.then((result)=>{
			console.log(result)
	})
```
## result #3

```
[
  {
    "type":"e-book",
    "shipping":true,
    "available":true,
    "information":{
      "author":"Nigel Rees",
      "title":"Sayings of the Century",
      "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
      "isbn":null,
      "price":8.95
    }
  },
  {
    "type":"e-book",
    "shipping":true,
    "available":true,
    "information":{
      "author":"Evelyn Waugh",
      "title":"Sword of Honour",
      "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
      "isbn":null,
      "price":12.99
    }
  },
  {
    "type":"e-book",
    "shipping":true,
    "available":true,
    "information":{
      "author":"Herman Melville",
      "title":"Moby Dick",
      "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
      "isbn":"0-553-21311-3",
      "price":8.99
    }
  },
  {
    "type":"e-book",
    "shipping":true,
    "available":true,
    "information":{
      "author":"J. R. R. Tolkien",
      "title":"The Lord of the Rings",
      "address":"The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ",
      "isbn":"0-395-19395-8",
      "price":22.99
    }
  }
]
```
## test with jest ( `npm install --save-dev jest` )
`npm test`

--------
with ❤ by [@kikerios](https://github.com/kikerios)
