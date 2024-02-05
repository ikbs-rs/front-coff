import DateFunction from "../../utilities/DateFunction"

const god = DateFunction.currYear

const EmptyEntities = 
{
  "tic_agenda": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tg": null,
    "begtm": "",
    "endtm": "",
    "valid": "1"
  },
  "cmn_par": {
    "id": null,
    "site": null,
    "code": "",
    "tp": null,
    "text": "",
    "short": "",
    "address": "",
    "place": "",
    "postcode": "",
    "tel": "",
    "activity": "",
    "pib": "",
    "idnum": "",
    "pdvnum": "",
    "begda": "",
    "endda": ""
  },
  "tic_agendatp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_agendatpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_agendax": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_art": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tp": null,
    "um": null,
    "tgp": null,
    "event": null,
    "eancode": "",
    "qrcode": "",
    "valid": "1",
    "grp": null,
    "color": "",
    "icon": "",
    "amount": "1",
    "combining": "1"
  },
  "tic_artcena": {
    "id": null,
    "site": null,
    "event": null,
    "art": null,
    "cena": null,
    "value": "1",
    "terr": null,
    "begda": "",
    "endda": "",
    "curr": null
  },
  "tic_artgrp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_artgrpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_artlink": {
		"id": null,
		"site": null,
		"art1": null,
		"art2": null,
		"tp": ""
	},
  "tic_artprivilege": {
    "id": null,
    "site": null,
    "art": null,
    "privilege": null,
    "begda": "",
    "endda": "",
    "value": ""
  },  
  "tic_artloc": {
    "id": null,
    "site": null,
    "art": null,
    "loc": null,
    "begda": "",
    "endda": ""
  },
  "tic_arttax": {
    "id": null,
    "art": null,
    "tax": null,
    "value": "",
    "begda": "",
    "endda": ""
  },
  "tic_arttp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_arttpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_artx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_cena": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tp": null,
    "valid": "1",
    "color": "",
    "icon": ""
  },
  "tic_cenatp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_cenatpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_cenax": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_chanellseatloc": {
    "id": null,
    "site": null,
    "chanell": null,
    "seatloc": null,
    "count": null,
    "begda": "",
    "datumod2": ""
  },
  "tic_channel": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_channeleventpar": {
    "id": null,
    "site": null,
    "channel": null,
    "event": null,
    "par": null
  },
  "tic_channelx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_condtp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_condtpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_discount": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tp": null,
    "valid": "1"
  },
  "tic_discounttp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_discounttpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_discountx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_doc": {
    "id": null,
    "site": null,
    "docvr": null,
    "date": "",
    "tm": "",
    "curr": "1",
    "currrate": "1",
    "usr": null,
    "status": "1",
    "docobj": null,
    "broj": null,
    "obj2": null,
    "opis": "",
    "timecreation": "",
    "storno": "0",
    "year": `${new Date().getFullYear().toString()}`
  },
	"tic_docb": {
		"id": null,
		"site": null,
		"doc": null,
		"tp": "",
		"bcontent": null
	},  
  "tic_docdocslink": {
    "id": null,
    "site": null,
    "doc": null,
    "docs": null
  },
  "tic_doclink": {
    "id": null,
    "site": null,
    "doc1": null,
    "doc2": null,
    "time": ""
  },
	"tic_docdelivery": {
		"id": null,
		"site": null,
		"doc": null,
		"courier": null,
		"adress": "",
		"amount": null,
		"dat": "",
		"datdelivery": "",
		"status": "0",
    "note": "",
    "parent": null,
    "country": null,
    "zip": "",
    "city": null    
	},  
	"tic_docpayment": {
			"id": null,
			"site": null,
			"doc": null,
			"paymenttp": null,
			"amount": null,
			"bcontent": null,
      "ccard": null
	},  
  "tic_docs": {
    "id": null,
    "site": null,
    "doc": null,
    "event": null,
    "loc": null,
    "art": null,
    "tgp": null,
    "taxrate": null,
    "price": 0,
    "input": 0,
    "output": 1,
    "discount": null,
    "curr": null,
    "currrate": null,
    "duguje": 0,
    "potrazuje": 0,
    "leftcurr": 0,
    "rightcurr": 0,
    "begtm": "",
    "endtm": "",
    "status": 1,
    "fee": 0,
		"par": null,
		"descript": "string",
    "storno": 0,
		"nart": ""
  },
  "tic_docslink": {
    "id": null,
    "site": null,
    "docs1": null,
    "docs2": null,
    "time": ""
  },
  "tic_doctp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1",
    "duguje": "1",
    "znak": ""
  },
  "tic_doctpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_docvr": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tp": null,
    "valid": "1"
  },
  "tic_docvrx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_event": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tp": null,
    "begda": "",
    "endda": "",
    "begtm": "",
    "endtm": "",
    "status": "0",
    "descript": "",
    "note": "",
    "event": null,
    "ctg": null,
    "loc": null,
		"par": null,
		"tmp": 0,
		"season": null
  },
  "tic_eventagenda": {
    "id": null,
    "site": null,
    "event": null,
    "agenda": null,
    "date": ""
  },
  "tic_eventart": {
  "id": null,
  "site": null,
  "event": null,
  "art": null,
  "descript": "",
  "begda": "",
  "endda":  "",
  "discount": 0,  
  "nart": "string",
  "color": "",
    "icon": ""
  },
	"tic_eventartcena": {
		"id": null,
		"site": null,
		"event": null,
		"art": null,
		"cena": null,
		"value": 0,
		"terr": -1,
		"begda": "",
		"endda": "",
		"curr": -1,
		"eventart": null
	},  
	"tic_eventartlink": {
			"id": null,
			"site": null,
			"eventart1": null,
			"eventart2": null,
			"tp": "A"
	},
  "tic_eventatttp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },  
  "tic_eventatt": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1",
    "inputp": null,
    "ddlist": "",
    "tp": null,
		"link": null,
		"linktp": null   
  },
  "tic_eventatts": {
    "id": null,
    "site": null,
    "event": null,
    "att": null,
    "value": "",
    "valid": "0",
    "text": "",
    "color": "",
    "icon": "",
    "condition": "",
		"link": null,
    "minfee": null
  },
  "tic_eventattx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_eventcenatp": {
    "id": null,
    "site": null,
    "event": null,
    "cenatp": null,
    "begda": "",
    "endda": ""
  },
  "tic_eventctg": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_eventctgx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_eventlink": {
    "id": null,
    "site": null,
    "event1": null,
    "event2": null,
    "note": ""
  },
  "tic_eventloc": {
    "id": null,
    "site": null,
    "event": null,
    "loc": null,
    "begda": "",
    "endda": "",
    "color": "",
    "icon": ""
  },
  "tic_eventobj": {
		  "id": null,
		  "site": null,
		  "event": null,
		  "objtp": null,
		  "obj": null,
		  "begda": "",
		  "endda": "",
		  "begtm": "",
		  "endtm": "",
      "color": "",
    "icon": ""
	  },
  "tic_events": {
    "id": null,
    "selection_duration": "0000",
    "payment_duration": "0000",
    "booking_duration": "0000",
    "max_ticket": 5,
    "online_payment": 1,
    "cash_payment": 1,
    "delivery_payment": 1,
    "presale_enabled": 0,
    "presale_until": "",
    "presale_discount": 0,
    "presale_discount_absolute": 0
  },
  "tic_eventtp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_eventtps": {
    "id": null,
    "site": null,
    "eventtp": null,
    "att": null,
    "inputtp": null,
    "value": "",
    "begda": "",
    "endda": ""
  },  
  "tic_eventtpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_eventx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_naime": {
    "id": null,
    "site": null,
    "par": null,
    "docs": null
  },
  "tic_parprivilege": {
    "id": null,
    "site": null,
    "par": null,
    "privilege": null,
    "begda": "",
    "datumod2": "",
    "maxprc": null,
    "maxval": null
  },
  "tic_paycard": {
		"attributes": {
			"id": null,
			"site": null,
			"docpayment": null,
			"ccard": null,
			"owner": "",
			"cardnum": "",
			"code": "",
			"dat": "",
			"amount": null,
			"status": null
		}
	},	
  "tic_privilege": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tp": null,
    "limitirano": "1",
    "valid": "1",
		"popust": null,
		"vrednost": "0",
		"uslov": "0",
		"domen": null
  },
  "tic_privilegecond": {
    "id": null,
    "site": null,
    "privilege": null,
    "begcondtp": null,
    "begcondition": "",
    "begvalue": "",
    "endcondtp": null,
    "endcondition": "",
    "endvalue": "",
    "begda": "",
    "endda": ""
  },
  "tic_privilegediscount": {
    "id": null,
    "site": null,
    "privilege": null,
    "discount": null,
    "value": 0,
    "begda": "",
    "endda": ""
  },
  "tic_privilegelink": {
    "id": null,
    "site": null,
    "privilege1": null,
    "privilege2": null,
    "begda": "",
    "endda": ""
  },
  "tic_privilegetp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_privilegetpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_privilegex": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_seat": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "tp": null,
    "valid": "1"
  },
  "tic_season": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_seasonx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_seatloc": {
    "id": null,
    "site": null,
    "loc": null,
    "seat": null,
    "count": "",
    "begda": "",
    "endda": ""
  },
  "tic_seattp": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_seattpatt": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "tic_seattpatts": {
    "id": null,
    "site": null,
    "seattp": null,
    "att": null,
    "value": "",
    "begda": "",
    "endda": ""
  },
  "tic_seattpattx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_seattpx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "tic_seatx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
	"tic_speccheck": {
			"id": null,
			"site": null,
			"docpayment": null,
			"bank": null,
			"code1": "",
			"code2": "",
			"code3": "",
			"amount": null
  },  
  "tic_stampa": {
    "id": null,
    "site": null,
    "docs": null,
    "time": ""
  },
  "cmn_loc": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "longtext": "",
    "tp": null,
    "valid": "1",
    "color": "",
    "icon": ""
  },
  "cmn_locatt": {
    "id": null,
    "site": null,
    "code": "",
    "text": "",
    "valid": "1"
  },
  "cmn_locatts": {
    "id": null,
    "site": null,
    "loc": null,
    "locatt": null,
    "text": "",
    "begda": "",
    "endda": ""
  },
  "cmn_locattx": {
    "id": null,
    "site": null,
    "tableid": null,
    "lang": "",
    "grammcase": "1",
    "text": ""
  },
  "cmn_loclink": {
    "id": null,
    "site": null,
    "tp": 1,
    "loctp1": null,
    "loc1": null,
    "loctp2": null,
    "loc2": null,
    "val": "",
    "begda": "",
    "endda": "99991231",
    "hijerarhija": null,
    "onoff": null,
    "color": "",
    "icon": ""
  },
  // "cmn_par": {
  //   "id": null,
  //   "site": null,
  //   "code": "",
  //   "tp": null,
  //   "text": "",
  //   "short": "",
  //   "address": "",
  //   "place": "",
  //   "postcode": "",
  //   "tel": "",
  //   "activity": "",
  //   "pib": "",
  //   "idnum": "",
  //   "pdvnum": "",
  //   "begda": "",
  //   "endda": ""
  // },
  "cmn_parlink": {
    "id": null,
    "site": null,
    "par1": null,
    "par2": null,
    "text": "",
    "begda": "",
    "endda": ""
  },
  "cmn_terrloc": {
    "id": null,
    "terr": null,
    "loc": null,
    "begda": "",
    "endda": ""
  },
  "cmn_paratts": {
    "id": null,
    "site": null,
    "par": null,
    "att": null,
    "text": "",
    "begda": "",
    "endda": ""
  }
}

export  {
    EmptyEntities,
}
