import { useEffect, useState } from "react";

import AreaIcon from "../../materials_ui/src/caseWorkApp/assetsCWA/svgs/areaIcon.svg?react";
import { DropdownButton } from "../../materials_ui/src/caseWorkApp/components/dropDownButton/DropdownButton";
import { LinkButton } from "../../materials_ui/src/caseWorkApp/components/LinkButton/LinkButton";
import Tooltip from "../../materials_ui/src/caseWorkApp/components/tooltip";
import classes from "./index.module.scss";

export type DropdownButtonItem = {
	id: string;
	label: string;
	ariaLabel: string;
	disabled: boolean;
};

export type DropdownButtonProps = {
	name?: string;
	dropDownItems: DropdownButtonItem[];
	callBackFn: (id: string) => void;
	ariaLabel?: string;
	dataTestId?: string;
	disabled?: boolean;
	showLastItemSeparator?: boolean;
	icon?: React.ReactElement;
};

const setDropDownActionItems = (mode: string) => {
	const dropDownItems: DropdownButtonItem[] = [
		{
			id: "1",
			label: "Log an Under/Over redaction",
			ariaLabel: "log an under or over redaction",
			disabled: false,
		},
		{
			id: "2",
			label: "Rotate document pages",
			ariaLabel: "rotate document pages",
			disabled: false,
		},
		{
			id: "3",
			label:
				mode === "deletion"
					? "Hide delete page options"
					: "Show delete page options",
			ariaLabel:
				mode === "deletion"
					? "hide delete page options"
					: "show delete page options",
			disabled: false,
		},
	];
	return dropDownItems;
};

type DocumentViewportAreaProps = {
	items: DropdownButtonItem[];
	activeTabId: string;
	redactAreaState: boolean;
	onRedactAreaStateChange: (x: boolean) => void;
	currentActiveTabId?: string;
	onRotateModeButtonClick: () => void;
	onDeleteModeButtonClick: () => void;
	mode: string;
};

export const DocumentViewportArea = ({
	items,
	activeTabId,
	redactAreaState,
	onRedactAreaStateChange,
	currentActiveTabId,
	onRotateModeButtonClick,
	onDeleteModeButtonClick,
	mode,
}: DocumentViewportAreaProps) => {
	const [name, setName] = useState<string>("");

	const handleRedactAreaToolButtonClick = () => {
		onRedactAreaStateChange(!redactAreaState);
	};

	const activeTabLabel = items.findIndex(
		(item) => item.id === activeTabId || item.id === currentActiveTabId
	);

	useEffect(() => {
		setName(items[activeTabLabel]?.label);
	}, [items, activeTabLabel]);

	return (
		<div className={classes.content}>
			<p style={{ color: "#ffffff" }}>{name}</p>
			<Tooltip
				text={redactAreaState ? "Redact area tool On" : "Redact area tool Off"}
			>
				<LinkButton
					className={
						redactAreaState
							? `${classes.areaToolBtn} ${classes.areaToolBtnEnabled}`
							: `${classes.areaToolBtn}`
					}
					dataTestId={"btn-area-tool"}
					id={"btn-area-tool"}
					ariaLabel={
						redactAreaState
							? "disable area redaction mode"
							: "enable area redaction mode"
					}
					onClick={handleRedactAreaToolButtonClick}
				>
					<AreaIcon />
				</LinkButton>
			</Tooltip>
			<DropdownButton
				name="Document actions"
				dropDownItems={setDropDownActionItems(mode)}
				callBackFn={(id) => {
					if (id === "2") onRotateModeButtonClick();
					if (id === "3") onDeleteModeButtonClick();
				}}
				ariaLabel="document actions dropdown"
				dataTestId={`document-actions-dropdown`}
				showLastItemSeparator={true}
			/>
		</div>
	);
};
