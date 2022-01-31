/*
	This file contains all definitions for the JSON files. Right now, it's maintained manually.
	In the future, this file should be generated by the JSON schema files.
*/

export interface Bundeslaender {
	BW: Bundesland;
	BY: Bundesland;
	BE: Bundesland;
	BB: Bundesland;
	HB: Bundesland;
	HH: Bundesland;
	HE: Bundesland;
	MV: Bundesland;
	NI: Bundesland;
	NW: Bundesland;
	RP: Bundesland;
	SL: Bundesland;
	SN: Bundesland;
	ST: Bundesland;
	SH: Bundesland;
	TH: Bundesland;
}

export const BundeslandIDs = [
	"BW",
	"BY",
	"BE",
	"BB",
	"HB",
	"HH",
	"HE",
	"MV",
	"NI",
	"NW",
	"RP",
	"SL",
	"SN",
	"ST",
	"SH",
	"TH",
];

export class Bundesland {
	land: string;
	gesundheit: Information;
	chef: Information;
	schule: Information;
}

export class Information {
	bezeichnung = "";
	titel = "";
	name = "";
	mail = "";
	fax = "";
	anschrift: string[] = [];
}

export class CNAData {
	anrede: string[] = [];
	gruss: string[] = [];
	topics: Topic[] = [];
}

export class Topic {
	name?: string;
	einleitung: WithCategory[] = [];
	betreff: WithCategory[] = [];
	beschwerde: WithCategory[] = [];
	appell: WithCategory[] = [];
}

export class WithCategory {
	text = "";
	kategorie = "allgemein";
}
