'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LineItem { label: string; amount: number; note?: string }

interface FormState {
  eligibility: string;
  primaryService: string;
  addOns: string[];
  receiveMethod: 'upload' | 'text' | 'hardcopy';
  hardcopyDeliveryType: 'personal' | 'courier';
  isCompanyDocument: string;
  repPurpose: string;
  wantsFollowUp: string;
  followUpFrequency: string;
  retrievalDelivery: string;
  deliveryDistance: string;
  uploadFile: File | null;
  uploadDesc: string;
  docType: string;
  docText: string;
  formattingStyle: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  pickupContact: string;
  pickupPhone: string;
  pickupNumDocs: string;
  pickupInstructions: string;
  courierCompany: string;
  courierTracking: string;
  courierContact: string;
  courierPickupLocation: string;
  courierInstructions: string;
  submissionLocation: string;
  submissionDate: string;
  submissionInstructions: string;
  followupDate: string;
  followupLocation: string;
  followupStatus: string;
  followupRef: string;
  repOrg: string;
  repOrgStreet: string;
  repOrgCity: string;
  repOrgCountry: string;
  repOrgState: string;
  repOrgLandmark: string;
  repGender: string;
  repTopic: string;
  repScript: string;
  repFile: File | null;
  retrievalItem: string;
  retrievalLocationVal: string;
  retrievalLocStreet: string;
  retrievalLocCity: string;
  retrievalLocCountry: string;
  retrievalLocState: string;
  retrievalDate: string;
  retrievalStatus: string;
  retrievalDeliveryStreet: string;
  retrievalDeliveryCity: string;
  retrievalDeliveryCountry: string;
  retrievalDeliveryState: string;
  companyName: string;
  companyCac: string;
  companyPosition: string;
  companyIdCard: File | null;
  companyAuthMethod: string;
  otpValue: string;
  companyAuthLetter: File | null;
  companyStreet: string;
  companyCity: string;
  companyCountry: string;
  companyState: string;
  authLetter: File | null;
  identityType: string;
  identityNumber: string;
  identityImage: File | null;
  identitySelfie: File | null;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  stateVal: string;
  city: string;
  landmark: string;
  streetAddress: string;
  confirmDetails: boolean;
  confirmAuthorize: boolean;
  saveRequest: boolean;
  lineItems: LineItem[];
  total: number;
}

type FormContextType = {
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  resetForm: () => void;
};

const defaultForm: FormState = {
  eligibility: '', primaryService: '', addOns: [],
  receiveMethod: 'upload', hardcopyDeliveryType: 'personal',
  isCompanyDocument: '', repPurpose: '', wantsFollowUp: '',
  followUpFrequency: '', retrievalDelivery: '', deliveryDistance: '',
  uploadFile: null, uploadDesc: '', docType: '', docText: '', formattingStyle: '',
  pickupAddress: '', pickupDate: '', pickupTime: '', pickupContact: '',
  pickupPhone: '', pickupNumDocs: '', pickupInstructions: '',
  courierCompany: '', courierTracking: '', courierContact: '',
  courierPickupLocation: '', courierInstructions: '',
  submissionLocation: '', submissionDate: '', submissionInstructions: '',
  followupDate: '', followupLocation: '', followupStatus: '', followupRef: '',
  repOrg: '', repOrgStreet: '', repOrgCity: '', repOrgCountry: 'Nigeria',
  repOrgState: '', repOrgLandmark: '', repGender: '', repTopic: '',
  repScript: '', repFile: null,
  retrievalItem: '', retrievalLocationVal: '', retrievalLocStreet: '',
  retrievalLocCity: '', retrievalLocCountry: 'Nigeria', retrievalLocState: '',
  retrievalDate: '', retrievalStatus: '', retrievalDeliveryStreet: '',
  retrievalDeliveryCity: '', retrievalDeliveryCountry: 'Nigeria', retrievalDeliveryState: '',
  companyName: '', companyCac: '', companyPosition: '', companyIdCard: null,
  companyAuthMethod: '', otpValue: '', companyAuthLetter: null,
  companyStreet: '', companyCity: '', companyCountry: 'Nigeria', companyState: '',
  authLetter: null, identityType: '', identityNumber: '',
  identityImage: null, identitySelfie: null,
  fullName: '', phone: '', email: '', country: 'Nigeria',
  stateVal: '', city: '', landmark: '', streetAddress: '',
  confirmDetails: false, confirmAuthorize: false, saveRequest: false,
  lineItems: [], total: 0,
};

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<FormState>(defaultForm);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  return (
    <FormContext.Provider value={{ form, setField, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useForm must be used within FormProvider');
  return ctx;
}