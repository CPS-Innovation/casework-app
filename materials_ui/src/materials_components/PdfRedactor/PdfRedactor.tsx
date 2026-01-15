import { useEffect, useMemo, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import { AreaIcon } from "./icons/AreaIcon";
import { EditIcon } from "./icons/EditIcon";
import { TickCircleIcon } from "./icons/TickCircleIcon";
import { PdfRedactorCenteredModal } from "./modals/PdfRedactorCenteredModal";
import { SaveToProceedToRedactionsModal } from "./modals/SaveToProceedToRedactionsModal";
import { SaveToProceedToRotationsModal } from "./modals/SaveToProceedToRotationsModal";
import { RedactionLogModal } from "../CaseworkRedactionLog/";
import { PdfRedactorPage } from "./PdfRedactorPage";
import type { TRedaction } from "./utils/coordUtils";
import { TDeletion, TIndexedDeletion } from "./utils/deletionUtils";
import { ModeStyleTag, type TMode } from "./utils/modeUtils";
import { TIndexedRotation, TRotation } from "./utils/rotationUtils";
import { useTrigger } from "./utils/useTriggger";
import "/node_modules/react-pdf/dist/cjs/Page/AnnotationLayer.css";
import "/node_modules/react-pdf/dist/cjs/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
	"/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

const useScaleHelper = (p?: { initScale?: number }) => {
	const [scale, setScale] = useState(p?.initScale ?? 1);

	const increaseScale = () => setScale((prev) => (prev += 0.25));
	const decreaseScale = () =>
		setScale((prev) => {
			const newScale = prev - 0.25;
			return newScale <= 0 ? prev : newScale;
		});
	const resetScale = () => setScale(1);

	return { scale, increaseScale, decreaseScale, resetScale };
};

const indexRedactionsOnPageNumber = (redactions: TRedaction[]) => {
	const temp: { [k: number]: TRedaction[] } = {};
	redactions.forEach((redaction) => (temp[redaction.pageNumber] = []));
	redactions.forEach((redaction) => temp[redaction.pageNumber].push(redaction));
	return temp;
};

const RedactionsFooter = (p: {
	redactions: TRedaction[];
	onRemoveAllRedactionsClick: () => void;
	onSaveRedactionsClick: (x: TRedaction[]) => void;
}) => {
	return (
		<div
			style={{
				border: "1px solid black",
				background: "white",
				color: "black",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "10px",
			}}
		>
			<button
				className="govuk-button govuk-button--inverse"
				onClick={() => p.onRemoveAllRedactionsClick()}
			>
				Remove all redactions
			</button>
			<span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span>
					{p.redactions.length === 1 && <>There is 1 redaction</>}
					{p.redactions.length > 1 && (
						<>There are {p.redactions.length} redactions</>
					)}
				</span>
				<button
					className="govuk-button"
					onClick={() => p.onSaveRedactionsClick(p.redactions)}
				>
					Save all redactions
				</button>
			</span>
		</div>
	);
};

const RotationsFooter = (p: {
	rotations: TRotation[];
	onRemoveAllRotationsClick: () => void;
	onSaveRotationsClick: (x: TRotation[]) => void;
}) => {
	return (
		<div
			style={{
				border: "1px solid black",
				background: "white",
				color: "black",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "10px",
			}}
		>
			<button
				className="govuk-button govuk-button--inverse"
				onClick={() => p.onRemoveAllRotationsClick()}
			>
				Remove all rotations
			</button>
			<span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span>
					{p.rotations.length === 1 && <>There is 1 rotation</>}
					{p.rotations.length > 1 && (
						<>There are {p.rotations.length} rotations</>
					)}
				</span>
				<button
					className="govuk-button"
					onClick={() => p.onSaveRotationsClick(p.rotations)}
				>
					Save all rotations
				</button>
			</span>
		</div>
	);
};

const DeletionsFooter = (p: {
	deletions: TDeletion[];
	onRemoveAllDeletionsClick: () => void;
	onSaveDeletionsClick: (x: TDeletion[]) => void;
}) => {
	return (
		<div
			style={{
				border: "1px solid black",
				background: "white",
				color: "black",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "10px",
			}}
		>
			<button
				className="govuk-button govuk-button--inverse"
				onClick={() => p.onRemoveAllDeletionsClick()}
			>
				Remove all deletions
			</button>
			<span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span>
					{p.deletions.length === 1 && <>There is 1 deletion</>}
					{p.deletions.length > 1 && (
						<>There are {p.deletions.length} deletions</>
					)}
				</span>
				<button
					className="govuk-button"
					onClick={() => p.onSaveDeletionsClick(p.deletions)}
				>
					Save all deletions
				</button>
			</span>
		</div>
	);
};

const usePreviousModeRef = (value: TMode) => {
	const currentRef = useRef(value);
	const previousModeRef = useRef<TMode>(value);

	useEffect(() => {
		previousModeRef.current = currentRef.current;
		currentRef.current = value;
	}, [value]);

	return { previousModeRef };
};

export const PdfRedactor = (p: {
	fileUrl: string;
	redactions: TRedaction[];
	hideToolbar: boolean;
	mode: TMode;
	onModeChange: (x: TMode) => void;
	onRedactionsChange: (redactions: TRedaction[]) => void;
	onAddRedactions: (redactions: TRedaction[]) => void;
	onRemoveRedactions: (redactionIds: string[]) => void;
	onSaveRedactions: () => Promise<void>;
	onSaveDeletions: () => Promise<void>;
	onSaveRotations: () => Promise<void>;
	indexedRotation: TIndexedRotation;
	onRotationsChange: (x: TIndexedRotation) => void;
	onRotationAdd: (x: TRotation) => void;
	onRotationRemove: (x: TRotation) => void;
	indexedDeletion: TIndexedDeletion;
	onDeletionsChange: (x: TIndexedDeletion) => void;
	onDeletionAdd: (x: TDeletion) => void;
	onDeletionRemove: (x: TDeletion) => void;
}) => {
	const { previousModeRef } = usePreviousModeRef(p.mode);

	// ref required for eventlistener
	const modeRef = useRef(p.mode);

	// Keep ref in sync with p.mode
	// - lift state up, but worsen developer experience???
	useEffect(() => {
		modeRef.current = p.mode;
	}, [p.mode]);

	const [displayToProceedModal, setDisplayToProceedModal] = useState<
		TMode | undefined
	>(undefined);

	const [redactionLogVisible, setRedactionLogVisible] = useState(false);

	const [numPages, setNumPages] = useState<number>();
	const scaleHelper = useScaleHelper();
	const pdfRedactorWrapperElmRef = useRef<HTMLDivElement>(null);

	const indexedRedactions = useMemo(() => {
		return indexRedactionsOnPageNumber(p.redactions);
	}, [p.redactions]);

	const rotations = useMemo(() => {
		return Object.values(p.indexedRotation);
	}, [p.indexedRotation]);
	const filteredRotations = useMemo(() => {
		return rotations.filter((rot) => rot.rotationDegrees !== 0);
	}, [rotations]);

	const deletions = useMemo(() => {
		return Object.values(p.indexedDeletion);
	}, [p.indexedDeletion]);
	const filteredDeletions = useMemo(() => {
		return deletions.filter((del) => !!del?.isDeleted);
	}, [deletions]);

	useEffect(() => {
		if (
			p.mode === "rotation" &&
			(p.redactions.length > 0 || filteredDeletions.length > 0)
		) {
			p.onModeChange(previousModeRef.current);
			setDisplayToProceedModal(previousModeRef.current);
		}
		if (
			(p.mode === "textRedact" || p.mode === "areaRedact") &&
			(filteredRotations.length > 0 || filteredDeletions.length > 0)
		) {
			p.onModeChange(previousModeRef.current);
			setDisplayToProceedModal(previousModeRef.current);
		}
		if (
			p.mode === "deletion" &&
			(filteredRotations.length > 0 || p.redactions.length > 0)
		) {
			p.onModeChange(previousModeRef.current);
			setDisplayToProceedModal(previousModeRef.current);
		}
	}, [p.mode]);

	const redactHighlightedTextTrigger = useTrigger();
	const redactHighlightedIfTextRedactionMode = () => {
		if (modeRef.current === "textRedact") redactHighlightedTextTrigger.fire();
	};

	useEffect(() => {
		const elm = pdfRedactorWrapperElmRef.current;
		if (!elm) return;

		elm.addEventListener("mouseup", redactHighlightedIfTextRedactionMode);
		return () =>
			elm.removeEventListener("mouseup", redactHighlightedIfTextRedactionMode);
	}, []);

	return (
		<div ref={pdfRedactorWrapperElmRef}>
			{displayToProceedModal && (
				<PdfRedactorCenteredModal
					onBackgroundClick={() => setDisplayToProceedModal(undefined)}
					onEscPress={() => setDisplayToProceedModal(undefined)}
				>
					{["areaRedact", "textRedact"].includes(displayToProceedModal) && (
						<SaveToProceedToRedactionsModal
							onClose={() => setDisplayToProceedModal(undefined)}
						/>
					)}
					{displayToProceedModal === "rotation" && (
						<SaveToProceedToRotationsModal
							onClose={() => setDisplayToProceedModal(undefined)}
						/>
					)}
					{displayToProceedModal === "deletion" && (
						<SaveToProceedToRotationsModal
							onClose={() => setDisplayToProceedModal(undefined)}
						/>
					)}
				</PdfRedactorCenteredModal>
			)}
			<RedactionLogModal
				isOpen={redactionLogVisible}
				onClose={() => {
					alert("closed");
				}}
			/>

			<ModeStyleTag mode={p.mode} />
			{!p.hideToolbar && (
				<div
					style={{
						border: "1px solid black",
						background: "white",
						color: "black",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "10px",
					}}
				>
					<span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
						<span>
							<button
								className={`govuk-button ${
									p.mode === "areaRedact" ? "" : "govuk-button--secondary"
								}`}
								onClick={() => p.onModeChange("areaRedact")}
							>
								<AreaIcon width={20} height={20} />
							</button>
							<button
								className={`govuk-button ${
									p.mode === "textRedact" ? "" : "govuk-button--secondary"
								}`}
								onClick={() => p.onModeChange("textRedact")}
							>
								<EditIcon width={20} height={20} />
							</button>
						</span>
						{p.mode === "textRedact" && (
							<button
								className="govuk-button govuk-button--secondary"
								onClick={() => redactHighlightedTextTrigger.fire()}
							>
								<TickCircleIcon width={20} height={20} />
							</button>
						)}
					</span>

					<span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
						<span>x{scaleHelper.scale.toFixed(2)}</span>
						<button
							className="govuk-button govuk-button--secondary"
							onClick={() => scaleHelper.decreaseScale()}
						>
							-
						</button>
						<button
							className="govuk-button govuk-button--secondary"
							onClick={() => scaleHelper.increaseScale()}
						>
							+
						</button>
						<button
							className="govuk-button govuk-button--secondary"
							onClick={() => scaleHelper.resetScale()}
						>
							x 1.00
						</button>
					</span>
				</div>
			)}
			<div style={{ position: "relative" }}>
				<div
					style={{
						position: "relative",
						height: "500px",
						width: "100%",
						overflowX: "scroll",
						overflowY: "scroll",
						backgroundColor: "#808080",
						paddingBottom: "70px",
					}}
				>
					<Document
						file={p.fileUrl}
						onLoadSuccess={(x) => {
							p.onRedactionsChange([]);
							setNumPages(x.numPages);
						}}
					>
						{[...Array(numPages)].map((_, j) => (
							<PdfRedactorPage
								key={`pdf-redactor-page-${j}`}
								pageNumber={j + 1}
								pagesAmount={numPages!}
								scale={scaleHelper.scale}
								onMouseMove={() => {}}
								redactHighlightedTextTriggerData={
									redactHighlightedTextTrigger.data
								}
								mode={p.mode}
								onPageRedactionsChange={() => {}}
								onAddRedactions={(x) => {
									p.onRedactionsChange([...p.redactions, ...x]);
									p.onAddRedactions(x);
								}}
								onRemoveRedactions={(ids) => {
									p.onRedactionsChange(
										p.redactions.filter((red) => !ids.includes(red.id))
									);
									p.onRemoveRedactions(ids);
								}}
								redactions={indexedRedactions[j + 1] ?? []}
								pageRotationDegrees={(() => {
									const rotation = p.indexedRotation[j + 1];
									return rotation ? rotation.rotationDegrees : 0;
								})()}
								onPageRotationChange={(x) => {
									p.onRotationsChange({
										...p.indexedRotation,
										[j + 1]: {
											id: crypto.randomUUID(),
											pageNumber: j + 1,
											rotationDegrees: x,
										},
									});
								}}
								pageIsDelete={!!p.indexedDeletion[j + 1]?.isDeleted}
								onPageIsDeleteChange={(isDeleted) => {
									const deletion = {
										id: crypto.randomUUID(),
										pageNumber: j + 1,
										isDeleted,
									};
									const fn = isDeleted ? p.onDeletionAdd : p.onDeletionRemove;
									fn(deletion);
									p.onDeletionsChange({
										...p.indexedDeletion,
										[j + 1]: deletion,
									});
								}}
							/>
						))}
					</Document>
				</div>
				{p.redactions.length > 0 && (
					<div
						style={{
							position: "absolute",
							bottom: "25px",
							left: 0,
							right: 0,
							zIndex: 800,
						}}
					>
						<RedactionsFooter
							redactions={p.redactions}
							onRemoveAllRedactionsClick={() => p.onRedactionsChange([])}
							onSaveRedactionsClick={async () => {
								setRedactionLogVisible(!redactionLogVisible);
								// await p.onSaveRedactions();
								// p.onRedactionsChange([]);
							}}
						/>
					</div>
				)}
				{filteredRotations.length > 0 && (
					<div
						style={{
							position: "absolute",
							bottom: "25px",
							left: 0,
							right: 0,
							zIndex: 800,
						}}
					>
						<RotationsFooter
							rotations={filteredRotations}
							onRemoveAllRotationsClick={() => p.onRotationsChange({})}
							onSaveRotationsClick={async () => {
								await p.onSaveRotations();
								p.onRotationsChange({});
							}}
						/>
					</div>
				)}
				{filteredDeletions.length > 0 && (
					<div
						style={{
							position: "absolute",
							bottom: "25px",
							left: 0,
							right: 0,
							zIndex: 800,
						}}
					>
						<DeletionsFooter
							deletions={filteredDeletions}
							onRemoveAllDeletionsClick={() => p.onDeletionsChange({})}
							onSaveDeletionsClick={async () => {
								await p.onSaveDeletions();
								p.onDeletionsChange({});
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
