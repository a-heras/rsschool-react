import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export function Modal({ isOpen, onClose, title, children, returnFocusRef}: ModalProps) {

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
        
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;
      
        const trigger = returnFocusRef?.current;
        const closeButton = modalRef.current?.querySelector<HTMLButtonElement>('.modal-close');
        closeButton?.focus();
      
        return () => {
            trigger?.focus();
        };
    }, [isOpen, returnFocusRef]);

    useEffect(() => {
        if (!isOpen) return;

        const modal = modalRef.current;
        if (!modal) return;
      
        const focusable = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
      
        const handleTab = (event: KeyboardEvent) => {
            if (event.key !== 'Tab' || focusable.length === 0) return;
        
            if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
            }
        };
      
        document.addEventListener('keydown', handleTab);
        return () => document.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                ref={modalRef}
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 id="modal-title">{title}</h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}