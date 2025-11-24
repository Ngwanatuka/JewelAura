// Toast.jsx – simple toast notification component
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Reuse slideIn animation defined in index.css (or define here if needed)
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--secondary);
  color: var(--text-white);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  animation: ${"${slideIn}"} 0.4s ease-out;
  z-index: 1000;
`;

/**
 * Simple toast component.
 * @param {Object} props
 * @param {string} props.message - Message to display.
 * @param {function} props.onClose - Callback when toast should disappear.
 */
const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // auto dismiss after 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    return <ToastContainer data-testid="toast">{message}</ToastContainer>;
};

export default Toast;
