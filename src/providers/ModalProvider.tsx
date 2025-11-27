import { createContext, useContext, useState, type ReactNode, useRef } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ModalContextType = {
    displayModal: (message: string) => void;
};

const ModalContext = createContext<ModalContextType>({
    displayModal: () => { },
});

export function ModalProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const timer = useRef<number | null>(null);

    const displayModal = (msg: string) => {
        if (timer.current) window.clearTimeout(timer.current);
        setMessage(msg);
        setShow(true);
        timer.current = window.setTimeout(() => setShow(false), 3000);
    };

    return (
        <ModalContext.Provider value={{ displayModal }}>
            {children}
            <ToastContainer
                position="top-center"
                className="p-3"
                style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1080 }}
            >
                <Toast
                    bg="dark"
                    show={show}
                    onClose={() => setShow(false)}
                    style={{ margin: "0 auto", minWidth: 320 }}
                >
                    <Toast.Body className="text-white text-center fs-6">{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);