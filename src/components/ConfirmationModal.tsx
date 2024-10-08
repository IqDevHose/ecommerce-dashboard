import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg max-w-md mx-auto">
        <h3 className="text-lg font-semibold">Confirm Delete</h3>
        <p className="mt-2">{message}</p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="ml-2">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
