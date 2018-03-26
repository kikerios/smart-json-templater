# 💪 Smart Json Templater 👌

## rules.json (Using JSONPath Syntax)
```
[
  {
    xpath: '$.object', // JSONPath Syntax
    save: 'type', // save the result in this key
  },
  {
    xpath: '$.entry[*].id', // JSONPath Syntax
    save: 'pageId', // save the result in this key
  },
  {
    xpath: '$.test', // JSONPath Syntax
    save: 'type2', // save the result in this key
  },
  {
    xpath: '$.entry[*].messaging[*].message.text', // JSONPath Syntax
    save: 'message', // save the result in this key
  },
  {
    xpath: '$.entry[*].messaging[*].message.mid', // JSONPath Syntax
    save: 'mid', // save the result in this key
  },
  {
    xpath: '$.entry[*].messaging[*].sender.id', // JSONPath Syntax
    save: 'senderId', // save the result in this key
  },
  {
    xpath: '$.entry[*].time', // JSONPath Syntax
    save: 'pageTime', // save the result in this key
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


## template.json
```
{
  "data": {
    "date": "{{pageTime}}", // use the key created in the rules
    "message": "{{message}}", // use the key created in the rules
    "type": "text-message" // static value
  },
  "database": {
    "id": "{{mid}}", // use the key created in the rules
    "pageId": "{{pageId}}" // use the key created in the rules
  },
  "user": {
    "id": "{{senderId}}" // use the key created in the rules
  },
  "analyze": true, // static value
  "normalizer": "{{~}}", // special key
}
```
### Special Keys

Key| Description
-----------------|------------
`{{~}}`               | Attach transformed data
`{{$}}`                | Attach original data / request

## raw.json (Original data / request)
```
{
  "object": "page",
  "test": "kike",
  "entry": [
    {
      "id": "<PAGE_ID1>",
      "time": 1458692752478,
      "messaging": [
        {
          "message": {
            "mid": "mid.1457764197618:41d102a3e1ae206a38",
            "text": "hello, world!"
          },
          "recipient": {
            "id": "<PAGE_ID>"
          },
          "sender": {
            "id": "<PSID>"
          },
          "timestamp": 1458692752478
        },
        {
          "message": {
            "mid": "mid#2",
            "text": "text#2"
          },
          "recipient": {
            "id": "recipient#2"
          },
          "sender": {
            "id": "sender#2"
          },
          "timestamp": 2
        }
      ]
    },
    {
      "id": "<PAGE_ID2>",
      "time": 14586927524780000,
      "messaging": []
    },
    {
      "id": "<PAGE_ID3>",
      "time": 14586927524780000,
      "messaging": [
        {
          "message": {
            "mid": "mid.1457764197618:41d102a3e1ae206a38",
            "text": "hello, world! 3"
          },
          "recipient": {
            "id": "<PAGE_ID>"
          },
          "sender": {
            "id": "<PSID>"
          },
          "timestamp": 1458692752478
        },
        {
          "message": {
            "mid": "mid#2",
            "text": "text#2ddd"
          },
          "recipient": {
            "id": "recipient#2"
          },
          "sender": {
            "id": "sender#2"
          },
          "timestamp": 2
        }
      ]
    }
  ]
}
```
### install
`npm i smart-json-templater --save`

### example
```
const templater = require('smart-json-templater')

// example data
const template = require('./template.json')
const rules = require('./rules.json')
const raw = require('./raw.json')

templater.convert(template, rules, raw)
    .then((result)=>{
        console.log(result)
    })
```
## result
```
[
  {
    "data":{
      "date":"1458692752478",
      "message":"hello, world!",
      "type":"text-message"
    },
    "database":{
      "id":"mid.1457764197618:41d102a3e1ae206a38",
      "pageId":"<PAGE_ID1>"
    },
    "user":{
      "id":"<PSID>"
    },
    "analyze":true,
    "normalizer":{
      "type":"page",
      "pageId":"<PAGE_ID1>",
      "type2":"kike",
      "message":"hello, world!",
      "mid":"mid.1457764197618:41d102a3e1ae206a38",
      "senderId":"<PSID>",
      "pageTime":1458692752478
    }
  },
  {
    "data":{
      "date":"1458692752478",
      "message":"text#2",
      "type":"text-message"
    },
    "database":{
      "id":"mid#2",
      "pageId":"<PAGE_ID1>"
    },
    "user":{
      "id":"sender#2"
    },
    "analyze":true,
    "normalizer":{
      "type":"page",
      "pageId":"<PAGE_ID1>",
      "type2":"kike",
      "message":"text#2",
      "mid":"mid#2",
      "senderId":"sender#2",
      "pageTime":1458692752478
    }
  },
  {
    "data":{
      "date":"14586927524780000",
      "message":"hello, world! 3",
      "type":"text-message"
    },
    "database":{
      "id":"mid.1457764197618:41d102a3e1ae206a38",
      "pageId":"<PAGE_ID3>"
    },
    "user":{
      "id":"<PSID>"
    },
    "analyze":true,
    "normalizer":{
      "type":"page",
      "pageId":"<PAGE_ID3>",
      "type2":"kike",
      "message":"hello, world! 3",
      "mid":"mid.1457764197618:41d102a3e1ae206a38",
      "senderId":"<PSID>",
      "pageTime":14586927524780000
    }
  },
  {
    "data":{
      "date":"14586927524780000",
      "message":"text#2ddd",
      "type":"text-message"
    },
    "database":{
      "id":"mid#2",
      "pageId":"<PAGE_ID3>"
    },
    "user":{
      "id":"sender#2"
    },
    "analyze":true,
    "normalizer":{
      "type":"page",
      "pageId":"<PAGE_ID3>",
      "type2":"kike",
      "message":"text#2ddd",
      "mid":"mid#2",
      "senderId":"sender#2",
      "pageTime":14586927524780000
    }
  }
]
```
with ❤ by [@kikerios](https://github.com/kikerios)
