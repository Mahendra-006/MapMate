import Button from "./Button"
import Modal from "./Modal"

export default function ErrorModal({ error, onClear }) {
    return (
      <Modal isOpen={!!error} onClose={onClear}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">An Error Occurred</h2>
          <p className="text-gray-600">{error}</p>
          <div className="text-right">
            <Button onClick={onClear} className="bg-red-500 hover:bg-red-600 text-white">
              Okay
            </Button>
          </div>
        </div>
      </Modal>
    );
  }