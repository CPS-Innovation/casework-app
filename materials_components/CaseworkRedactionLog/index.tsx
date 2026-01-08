import Modal from "./Modal";

const RedactionLogModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<>
				<h1>Redaction Log</h1>
			</>
		</Modal>
	);
};

export { RedactionLogModal };
