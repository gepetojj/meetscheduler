import { createContext, useContext, useState } from "react";

import { Schedule } from "../entities";

export interface MSCSchedule extends Schedule {
	update(data: Schedule): void;
}

export type Setting =
	| "firstTimeAccess"
	| "useMondayAsFirstDay"
	| "autoOpenAppointments"
	| "linkSuffix";

export const SETTINGS: Setting[] = [
	"firstTimeAccess",
	"useMondayAsFirstDay",
	"autoOpenAppointments",
	"linkSuffix",
];

export interface Settings {
	firstTimeAccess: boolean;
	useMondayAsFirstDay: boolean;
	autoOpenAppointments: boolean;
	linkSuffix: string;
}

export interface MSCSettings extends Settings {
	update(key: Setting, value: any): void;
}

export interface IMSContext {
	settings: MSCSettings;
	schedule: MSCSchedule;
}

export const MSContext = createContext<IMSContext>({
	settings: {
		firstTimeAccess: true,
		useMondayAsFirstDay: true,
		autoOpenAppointments: true,
		linkSuffix: "",
		update: (key, value) => {},
	},
	schedule: {
		monday: [],
		tuesday: [],
		wednesday: [],
		thursday: [],
		friday: [],
		saturday: [],
		sunday: [],
		update: (data) => {},
	},
});

export const MSCProvider = ({ children }) => {
	const [settings, setSettings] = useState<Settings>({
		firstTimeAccess: true,
		useMondayAsFirstDay: true,
		autoOpenAppointments: true,
		linkSuffix: "",
	});
	const [schedule, setSchedule] = useState<Schedule>({
		monday: [],
		tuesday: [],
		wednesday: [],
		thursday: [],
		friday: [],
		saturday: [],
		sunday: [],
	});

	const updateSettings = (key: Setting, value: any) => {
		setSettings({ ...settings, [key]: value });
	};

	const updateSchedule = (data: Schedule) => {
		setSchedule(data);
	};

	return (
		<MSContext.Provider
			value={{
				settings: { ...settings, update: updateSettings },
				schedule: { ...schedule, update: updateSchedule },
			}}
		>
			{children}
		</MSContext.Provider>
	);
};

export const useMSContext = () => {
	const context = useContext(MSContext);
	return context;
};
