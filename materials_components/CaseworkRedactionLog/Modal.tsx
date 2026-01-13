import React, { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { SelectList } from "../../materials_ui/src/components/SelectList/SelectList";
import classes from "./modal.module.scss";
import AreaIcon from "../../materials_ui/src/caseWorkApp/assetsCWA/svgs/areaIcon.svg";
import CloseIcon from "../../materials_ui/src/caseWorkApp/assetsCWA/svgs/closeIconBold.svg?react";

const redactionLogGuidanceContent = (fnPassedAsArgument) => {
	return (
		<div className={classes.redactionLogGuidanceWrapper}>
			<p
				style={{
					color: "white",
					fontWeight: "bold",
					fontSize: "1.1875rem",
					margin: "0 0 -1rem .625rem",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				Redaction Log Guidance
				<button
					data-testid="btn-modal-close"
					type="button"
					aria-label="close guidance"
					onClick={() => {
						fnPassedAsArgument(false);
					}}
					style={{
						width: 50,
						height: 50,
						cursor: "pointer",
						background: "black",
						translate: "29% -32%",
						borderRadius: "0 .5rem 0 0",
						alignContent: "center",
						justifyContent: "center",
						padding: "0",
						margin: "0",
					}}
				>
					<CloseIcon width={40} height={40} color="white" />
				</button>
			</p>
			<ul className={classes.redactionLogGuidanceList}>
				<li>
					This popup allows the capture of details which will be recorded into
					the Redaction Log automatically
				</li>
				<li>
					Once added, if an entry needs editing or deleting, this should be done
					in the Redaction log
				</li>
				<li>
					Contact with the Investigative Agency or the CPS is not automatic -
					you should contact any such bodies yourself
				</li>
			</ul>
		</div>
	);
};

const Modal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		shouldFocusError: false,
	});

	const redactionModalURN = "54KR7689125";
	const [redactionLogGuidanceVisible, setRedactionLogGuidanceVisible] =
		useState(false);

	const handleRedactionLogGuidance = (arg) => {
		setRedactionLogGuidanceVisible(arg);
	};

	return (
		<div
			className={classes.redactionLogModalOverlay}
			aria-label={"Redaction log modal"}
			aria-description={`Fill and submit under or over redaction log form for the document`}
		>
			<div className={classes.redactionLogModalContent}>
				<div className={classes.redactionLogModalContentHeader}>
					<h1>
						{`${redactionModalURN}`} -{" "}
						<span className={classes.greyColor}>
							<b>Redaction Log</b>
						</span>
					</h1>
					<div>
						<div
							onClick={() => handleRedactionLogGuidance(true)}
							className={classes.redactionLogGuidanceTitle}
							style={{ cursor: "pointer", textAlign: "right" }}
						>
							<img
								src={AreaIcon}
								width="16"
								height="16"
								alt="Redaction Log Guidance"
							/>{" "}
							<span
								style={{
									fontWeight: "normal",
									textDecoration: "underline",
									color: "#1D70C3",
									cursor: "pointer",
									textAlign: "right",
								}}
							>
								Redaction Log Guidance
							</span>
						</div>
						{redactionLogGuidanceVisible && (
							<div>
								{redactionLogGuidanceContent(handleRedactionLogGuidance)}
							</div>
						)}
					</div>
				</div>
				<div className={classes.redactionLogModalContentBody}>
					<div className={classes.controllersContainer}>
						<div className={classes.controlItem}>
							<Controller
								name="cpsArea"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field }) => {
									return (
										<SelectList
											{...field}
											id="select-cps-area"
											data-testid="select-cps-area"
											label="CPS Area or Central Casework Division:"
											error=""
											options={[
												{
													label: "Select witness",
													value: "",
													id: "",
												},
											]}
											// items={"getMappedSelectItems().areaOrDivisions"}
										/>
									);
								}}
							/>
						</div>
						<div className={classes.controlItem}>
							<Controller
								name="cpsArea"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field }) => {
									return (
										<SelectList
											{...field}
											id="select-cps-business-unit"
											data-testid="select-cps-business-unit"
											label="CPS Business Unit:"
											error=""
											options={[
												{
													label: "Select unit",
													value: "",
													id: "",
												},
											]}
											// items={"getMappedSelectItems().areaOrDivisions"}
										/>
									);
								}}
							/>
						</div>
						<div className={classes.controlItem}>
							<Controller
								name="cpsArea"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field }) => {
									return (
										<SelectList
											{...field}
											id="select-cps-investigative-agency"
											data-testid="select-cps-investigative-agency"
											label="Investigative Agency:"
											error=""
											options={[
												{
													label: "Investigative Agency",
													value: "",
													id: "",
												},
											]}
											// items={"getMappedSelectItems().areaOrDivisions"}
										/>
									);
								}}
							/>
						</div>
						<div className={classes.controlItem}>
							<Controller
								name="cpsArea"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field }) => {
									return (
										<SelectList
											{...field}
											id="select-cps-charge-status"
											data-testid="select-cps-charge-status"
											label="Charge Status:"
											error=""
											options={[
												{
													label: "Charge Status",
													value: "",
													id: "",
												},
											]}
											// items={"getMappedSelectItems().areaOrDivisions"}
										/>
									);
								}}
							/>
						</div>
						<div className={classes.controlItem}>
							<Controller
								name="cpsArea"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field }) => {
									return (
										<SelectList
											{...field}
											id="select-cps-document-type"
											data-testid="select-cps-document-type"
											label="Document Type:"
											error=""
											options={[
												{
													label: "Select document type",
													value: "",
													id: "",
												},
											]}
											// items={"getMappedSelectItems().areaOrDivisions"}
										/>
									);
								}}
							/>
						</div>
					</div>
				</div>
				<div className={classes.redactionLogModalContentFooter}>
					<button
						className="govuk-button"
						data-module="govuk-button"
						type="submit"
					>
						Save and Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
