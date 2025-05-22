import { Token } from './types'

export interface CreateModalProps {
  isOpen: boolean;
  createModalStep: "details" | "confirmation" | "success";
  selectedToken: Token | null;
  creditClientSecret: string;
  confirmationInput: string;
  fetchedData: { creditClientId: string; creditClientSecret: string; metadata: string } | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  creationResult: string | null;
  isCreateConfirmationValid: boolean;
  getCreateTransform: () => string;
  closeCreateModal: () => void;
  handleCreateNextStep: (e: React.FormEvent) => void;
  handleCreateBackToDetails: () => void;
  handleCreateTSE: () => void;
  setCreditClientSecret: (value: string) => void;
  setConfirmationInput: (value: string) => void;
}



export interface DesktopTableProps {
  tokens: Token[];
  activeDropdown: number | null;
  hoveredRow: number | null;
  toggleDropdown: (index: number) => void;
  openCreateTSEModal: (token: Token) => void;
  openTerminateModal: (token: Token) => void;
  setHoveredRow: (index: number | null) => void;
}


export interface FilterButtonsProps {
  filterState: "active" | "terminated";
  setFilterState: (state: "active" | "terminated") => void;
}


export interface MobileTableProps {
  tokens: Token[];
  activeDropdown: number | null;
  showAll: boolean;
  toggleDropdown: (index: number) => void;
  openCreateTSEModal: (token: Token) => void;
  openTerminateModal: (token: Token) => void;
  setShowAll: (show: boolean) => void;
}


export interface TerminateModalProps {
  isOpen: boolean;
  terminateModalStep: "confirmation" | "success" | "error";
  selectedToken: Token | null;
  terminateConfirmationInput: string;
  isTerminating: boolean;
  error: string | null;
  terminationResult: string | null;
  isTerminateConfirmationValid: boolean;
  getTerminateTransform: () => string;
  closeTerminateModal: () => void;
  handleTerminateCreditToken: () => void;
  setTerminateConfirmationInput: (value: string) => void;
}