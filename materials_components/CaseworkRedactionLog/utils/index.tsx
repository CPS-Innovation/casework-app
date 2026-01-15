type TChangeType = { key: string; value: number }[];

const ChargingType: TChangeType = [
	{ key: "Pre-Charge", value: 0 },
	{ key: "Post-Charge", value: 1 },
];

export { ChargingType };
