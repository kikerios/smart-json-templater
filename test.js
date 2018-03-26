const template = {
  "data": {
    "date": "{{pageTime}}",
    "message": "{{message}}",
    "type": "text-message"
  },
  "database": {
    "id": "{{mid}}",
    "pageId": "{{pageId}}"
  },
  "user": {
    "id": "{{senderId}}"
  },
  "analyze": true,
  "raw": "{{raw}}"
}

const raw = {
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

const rules = [
  {
    xpath: '$.object',
    ignore: null,
    save: 'type',
  },
  {
    xpath: '$.entry[*].id',
    ignore: null,
    save: 'pageId',
  },
  {
    xpath: '$.test',
    ignore: null,
    save: 'type2',
  },
  {
    xpath: '$.entry[*].messaging[*].message.text',
    ignore: null,
    save: 'message',
  },
  {
    xpath: '$.entry[*].messaging[*].message.mid',
    ignore: null,
    save: 'mid',
  },
  {
    xpath: '$.entry[*].messaging[*].sender.id',
    ignore: null,
    save: 'senderId',
  },
  {
    xpath: '$.entry[*].time',
    ignore: null,
    save: 'pageTime',
  },
]

const templater = require('./index')

templater.convert(template, rules, raw)
  .then((result) => {
    console.log(JSON.stringify(result))
  })
