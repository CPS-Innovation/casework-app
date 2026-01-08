import classes from "./modal.module.scss";

const redactionLogGuidanceContent = () => {
	return (
		<div className={classes.redactionLogGuidanceWrapper}>
			<p className={classes.redactionLogGuidanceTitle}>
				Redaction Log Guidance
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

	const redactionModalURN = "54KR7689125";

	return (
		<div
			className={classes.redactionLogModalOverlay}
			ariaLabel={"Redaction log modal"}
			ariaDescription={`Fill and submit under or over redaction log form for the document`}
		>
			<div className={classes.redactionLogModalContent}>
				<div className={classes.redactionLogModalContentHeader}>
					<h1>{`${redactionModalURN} - Redaction Log`}</h1>
					<p onMouseDown={() => {}}>
						redactionGuidanceLog
						{/* <div>{redactionLogGuidanceContent()}</div> */}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Modal;
