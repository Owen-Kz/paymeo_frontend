// src/hooks/useModals.js
import { useState, useCallback } from 'react';

export const useModals = () => {
  const [modals, setModals] = useState({
    sendMoney: false,
    requestMoney: false,
    escrowPay: false,
    buyCredit: false
  });

  const openModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      sendMoney: false,
      requestMoney: false,
      escrowPay: false,
      buyCredit: false
    });
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals
  };
};