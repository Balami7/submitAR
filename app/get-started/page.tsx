'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import {
  MdWarning,
  MdUpload,
  MdLocalShipping,
  MdTextFields,
  MdLightbulb,
  MdEmail,
  MdPhone,
} from 'react-icons/md';
import {
  FaCheckCircle,
  FaUser,
  FaBuilding,
} from 'react-icons/fa';

// ─── Pricing constants ────────────────────────────────────────────────────────
const PRICES = {
  submission: 35_000,
  followup_standalone: 35_000,
  followup_single: 35_000,
  followup_biweekly: 70_000,
  followup_thrice: 100_000,
  followup_weekly4: 135_000,
  submission_followup_single: 65_000,
  submission_followup_biweekly: 90_000,
  submission_followup_thrice: 105_000,
  submission_followup_weekly4: 120_000,
  representation_attendance: 50_000,
  representation_speaking: 100_000,
  retrieval: 35_000,
} as const;

function fmt(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

type LineItem = { label: string; amount: number; note?: string };

type FormErrors = Partial<{
  eligibility: string;
  primaryService: string;
  receiveMethod_file: string;
  receiveMethod_docType: string;
  receiveMethod_text: string;
  receiveMethod_pickupAddress: string;
  receiveMethod_pickupDate: string;
  receiveMethod_pickupTime: string;
  receiveMethod_pickupContact: string;
  receiveMethod_pickupPhone: string;
  receiveMethod_hardcopyDeliveryType: string;
  receiveMethod_courierCompany: string;
  receiveMethod_courierTracking: string;
  submission_location: string;
  submission_date: string;
  followup_frequency: string;
  followup_date: string;
  followup_location: string;
  rep_org: string;
  rep_purpose: string;
  retrieval_item: string;
  retrieval_location: string;
  retrieval_date: string;
  retrieval_delivery: string;
  retrieval_distance: string;
  retrieval_address: string;
  docCategory: string;
  company_name: string;
  company_cac: string;
  company_position: string;
  company_idCard: string;
  company_auth: string;
  company_otp: string;
  auth_letter: string;
  identity_type: string;
  identity_number: string;
  identity_image: string;
  identity_selfie: string;
  info_name: string;
  info_phone: string;
  info_email: string;
  info_country: string;
  info_state: string;
  info_city: string;
  info_address: string;
  confirm_details: string;
  confirm_authorize: string;
}>;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
      <span aria-hidden>⚠</span> {msg}
    </p>
  );
}

function errBorder(msg?: string) {
  return msg ? 'border-red-400' : 'border-gray-200';
}

// ─── Nigeria states ───────────────────────────────────────────────────────────
const NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
];

// ─── Countries with their states/provinces ───────────────────────────────────
const COUNTRIES: Record<string, string[]> = {
  'Nigeria': NIGERIA_STATES,
  'Ghana': ['Ashanti','Brong-Ahafo','Central','Eastern','Greater Accra','Northern','Upper East','Upper West','Volta','Western'],
  'Kenya': ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi','Kitale','Garissa','Kakamega'],
  'South Africa': ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'],
  'United Kingdom': ['England','Scotland','Wales','Northern Ireland'],
  'United States': ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
  'Canada': ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan'],
  'Other': ['N/A'],
};

// ─── Secondary service upsell configs ────────────────────────────────────────
const SECONDARY_OPTIONS: Record<string, { id: string; label: string; desc: string; price: string }[]> = {
  submission: [
    { id: 'representation', label: 'Representation', desc: 'Have someone physically attend on your behalf during the submission process.', price: '₦50,000' },
    { id: 'retrieval',      label: 'Retrieval',       desc: 'We collect the document once it has been processed and deliver it to you.', price: '₦35,000' },
  ],
  followup: [
    { id: 'representation', label: 'Representation', desc: 'Have someone present at the office when following up on your document.', price: '₦50,000' },
    { id: 'retrieval',      label: 'Retrieval',       desc: 'We collect the document once it has been processed and deliver it to you.', price: '₦35,000' },
  ],
  representation: [
    { id: 'retrieval', label: 'Retrieval', desc: 'We collect the resulting document and deliver it to you after representation.', price: '₦35,000' },
  ],
  retrieval: [],
};

// ─── Reusable address block ───────────────────────────────────────────────────
interface AddressBlockProps {
  streetAddress: string; setStreetAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  stateVal: string; setStateVal: (v: string) => void;
  landmark?: string; setLandmark?: (v: string) => void;
  errors?: { street?: string; city?: string; country?: string; state?: string };
  compact?: boolean;
}

function AddressBlock({
  streetAddress, setStreetAddress,
  city, setCity,
  country, setCountry,
  stateVal, setStateVal,
  landmark, setLandmark,
  errors = {},
  compact = false,
}: AddressBlockProps) {
  const availableStates = COUNTRIES[country] ?? [];
  useEffect(() => { setStateVal(''); }, [country]);

  return (
    <div className={`space-y-3 ${compact ? '' : 'pt-1'}`}>
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">Country</label>
        <select value={country} onChange={e => setCountry(e.target.value)}
          className={`w-full border p-3 text-sm ${errBorder(errors.country)}`}>
          <option value="">Select Country...</option>
          {Object.keys(COUNTRIES).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <FieldError msg={errors.country} />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">State / Province</label>
        <select value={stateVal} onChange={e => setStateVal(e.target.value)}
          className={`w-full border p-3 text-sm ${errBorder(errors.state)}`}
          disabled={!country}>
          <option value="">Select State...</option>
          {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <FieldError msg={errors.state} />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">City / LGA</label>
        <input type="text" placeholder="e.g. Ikeja, Aba, Kaduna" value={city}
          onChange={e => setCity(e.target.value)}
          className={`w-full border p-3 text-sm ${errBorder(errors.city)}`} />
        <FieldError msg={errors.city} />
      </div>
      {setLandmark !== undefined && (
        <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">
            Nearest Landmark <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <input type="text" placeholder="e.g. Behind First Bank, Near Shoprite" value={landmark ?? ''}
            onChange={e => setLandmark(e.target.value)}
            className="w-full border border-gray-200 p-3 text-sm" />
        </div>
      )}
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">Street Address</label>
        <input type="text" placeholder="House/flat number, street name" value={streetAddress}
          onChange={e => setStreetAddress(e.target.value)}
          className={`w-full border p-3 text-sm ${errBorder(errors.street)}`} />
        <FieldError msg={errors.street} />
      </div>
    </div>
  );
}

export default function SubmitarForm() {
  // ─── Core state ──────────────────────────────────────────────────────────
  const [eligibility, setEligibility] = useState('');
  const [primaryService, setPrimaryService] = useState('');
  const [addOns, setAddOns] = useState<string[]>([]);

  const [receiveMethod, setReceiveMethod] = useState<'upload' | 'text' | 'hardcopy'>('upload');
  const [hardcopyDeliveryType, setHardcopyDeliveryType] = useState<'personal' | 'courier'>('personal');

  const [isCompanyDocument, setIsCompanyDocument] = useState('');
  const [repPurpose, setRepPurpose] = useState('');
  const [wantsFollowUp, setWantsFollowUp] = useState('');
  const [followUpFrequency, setFollowUpFrequency] = useState('');
  const [otpSent, setOtpSent] = useState<'email' | 'mobile' | null>(null);
  const [retrievalDelivery, setRetrievalDelivery] = useState('');
  const [deliveryDistance, setDeliveryDistance] = useState('');

  // ─── Receive method fields ────────────────────────────────────────────────
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDesc, setUploadDesc] = useState('');
  const [docType, setDocType] = useState('');
  const [docText, setDocText] = useState('');
  const [formattingStyle, setFormattingStyle] = useState('');

  // Personal Delivery (Hardcopy)
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupContact, setPickupContact] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [pickupNumDocs, setPickupNumDocs] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');

  // Courier Delivery
  const [courierCompany, setCourierCompany] = useState('');
  const [courierTracking, setCourierTracking] = useState('');
  const [courierContact, setCourierContact] = useState('');
  const [courierPickupLocation, setCourierPickupLocation] = useState('');
  const [courierInstructions, setCourierInstructions] = useState('');

  // ─── Submission details ───────────────────────────────────────────────────
  const [submissionLocation, setSubmissionLocation] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [submissionInstructions, setSubmissionInstructions] = useState('');

  // ─── Standalone follow-up ─────────────────────────────────────────────────
  const [followupDate, setFollowupDate] = useState('');
  const [followupLocation, setFollowupLocation] = useState('');
  const [followupStatus, setFollowupStatus] = useState('');
  const [followupRef, setFollowupRef] = useState('');

  // ─── Representation ───────────────────────────────────────────────────────
  const [repOrg, setRepOrg] = useState('');
  const [repOrgStreet, setRepOrgStreet] = useState('');
  const [repOrgCity, setRepOrgCity] = useState('');
  const [repOrgCountry, setRepOrgCountry] = useState('Nigeria');
  const [repOrgState, setRepOrgState] = useState('');
  const [repOrgLandmark, setRepOrgLandmark] = useState('');

  const [repGender, setRepGender] = useState('');
  const [repTopic, setRepTopic] = useState('');
  const [repScript, setRepScript] = useState('');
  const [repFile, setRepFile] = useState<File | null>(null);

  // ─── Retrieval ────────────────────────────────────────────────────────────
  const [retrievalItem, setRetrievalItem] = useState('');
  const [retrievalLocationVal, setRetrievalLocationVal] = useState('');
  const [retrievalLocStreet, setRetrievalLocStreet] = useState('');
  const [retrievalLocCity, setRetrievalLocCity] = useState('');
  const [retrievalLocCountry, setRetrievalLocCountry] = useState('Nigeria');
  const [retrievalLocState, setRetrievalLocState] = useState('');

  const [retrievalDate, setRetrievalDate] = useState('');
  const [retrievalStatus, setRetrievalStatus] = useState('');
  const [retrievalAddress, setRetrievalAddress] = useState('');
  const [retrievalDeliveryStreet, setRetrievalDeliveryStreet] = useState('');
  const [retrievalDeliveryCity, setRetrievalDeliveryCity] = useState('');
  const [retrievalDeliveryCountry, setRetrievalDeliveryCountry] = useState('Nigeria');
  const [retrievalDeliveryState, setRetrievalDeliveryState] = useState('');

  // ─── Company verification ─────────────────────────────────────────────────
  const [companyName, setCompanyName] = useState('');
  const [companyCac, setCompanyCac] = useState('');
  const [companyPosition, setCompanyPosition] = useState('');
  const [companyIdCard, setCompanyIdCard] = useState<File | null>(null);
  const [companyAuthMethod, setCompanyAuthMethod] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [companyAuthLetter, setCompanyAuthLetter] = useState<File | null>(null);
  const [companyStreet, setCompanyStreet] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyCountry, setCompanyCountry] = useState('Nigeria');
  const [companyState, setCompanyState] = useState('');

  // ─── Auth & identity ──────────────────────────────────────────────────────
  const [authLetter, setAuthLetter] = useState<File | null>(null);
  const [identityType, setIdentityType] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [identityImage, setIdentityImage] = useState<File | null>(null);
  const [identitySelfie, setIdentitySelfie] = useState<File | null>(null);

  // ─── Personal info ────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [stateVal, setStateVal] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  // ─── Confirmation ─────────────────────────────────────────────────────────
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [confirmAuthorize, setConfirmAuthorize] = useState(false);
  const [saveRequest, setSaveRequest] = useState(false);

  // ─── Validation state ─────────────────────────────────────────────────────
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // ─── Derived helpers ──────────────────────────────────────────────────────
  const has = (id: string) => primaryService === id || addOns.includes(id);

  useEffect(() => { setAddOns([]); setFollowUpFrequency(''); }, [primaryService]);

  const toggleAddOn = (id: string) => {
    setAddOns(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const DELIVERY_FEES: Record<string, { label: string; amount: number }> = {
    within5:  { label: 'Delivery (0–5 km)',   amount: 2_000  },
    '5to15':  { label: 'Delivery (5–15 km)',  amount: 5_000  },
    '15to30': { label: 'Delivery (15–30 km)', amount: 10_000 },
    above30:  { label: 'Delivery (30+ km)',   amount: 15_000 },
  };

  const PRIMARY_SERVICES = [
    { id: 'submission',     label: 'Submission',     price: '₦35,000',  icon: MdUpload },
    { id: 'followup',       label: 'Follow-Up',      price: '₦35,000',  icon: FaCheckCircle },
    { id: 'representation', label: 'Representation', price: '₦50–100k', icon: FaUser },
    { id: 'retrieval',      label: 'Retrieval',      price: '₦35,000',  icon: MdLocalShipping },
  ];

  // ─── Validation ───────────────────────────────────────────────────────────
  function validate(): FormErrors {
    const e: FormErrors = {};

    if (!eligibility) { e.eligibility = 'Please answer the eligibility question.'; }
    if (eligibility !== 'no') return e;

    if (!primaryService) { e.primaryService = 'Please select a primary service.'; }

    if (has('submission')) {
      if (receiveMethod === 'upload' && !uploadFile) {
        e.receiveMethod_file = 'Please upload a document.';
      }
      if (receiveMethod === 'text') {
        if (!docType.trim()) e.receiveMethod_docType = 'Please enter the document type.';
        if (!docText.trim()) e.receiveMethod_text = 'Please paste the document text.';
      }
      if (receiveMethod === 'hardcopy') {
        if (!hardcopyDeliveryType) {
          e.receiveMethod_hardcopyDeliveryType = 'Please select a delivery type.';
        }

        if (hardcopyDeliveryType === 'personal') {
          if (!pickupAddress.trim())  e.receiveMethod_pickupAddress = 'Pickup address is required.';
          if (!pickupDate)            e.receiveMethod_pickupDate    = 'Pickup date is required.';
          if (!pickupTime)            e.receiveMethod_pickupTime    = 'Pickup time is required.';
          if (!pickupContact.trim())  e.receiveMethod_pickupContact = 'Contact person name is required.';
          if (!pickupPhone.trim())    e.receiveMethod_pickupPhone   = 'Phone number is required.';
        } else if (hardcopyDeliveryType === 'courier') {
          if (!courierCompany.trim())    e.receiveMethod_courierCompany = 'Courier company name is required.';
          if (!courierTracking.trim())   e.receiveMethod_courierTracking = 'Tracking number is required.';
        }
      }
      if (!submissionLocation.trim()) e.submission_location = 'Submission location is required.';
      if (!submissionDate)            e.submission_date     = 'Submission date is required.';
      if (wantsFollowUp === 'yes' && !followUpFrequency) {
        e.followup_frequency = 'Please choose a follow-up frequency.';
      }
    }

    if (primaryService === 'followup') {
      if (!followupDate)            e.followup_date     = 'Please enter the original submission date.';
      if (!followupLocation.trim()) e.followup_location = 'Please enter where the document was submitted.';
      if (!followUpFrequency)       e.followup_frequency = 'Please choose a follow-up frequency.';
    }

    if (has('representation')) {
      if (primaryService === 'representation') {
        if (!repOrg.trim()) e.rep_org = 'Organization/office name is required.';
      }
      if (!repPurpose)    e.rep_purpose = 'Please select the representation purpose.';
    }

    if (has('retrieval')) {
      if (!retrievalItem.trim())        e.retrieval_item     = 'Please describe what we are retrieving.';
      if (primaryService === 'retrieval') {
        if (!retrievalLocationVal.trim()) e.retrieval_location = 'Please provide the retrieval location.';
        if (!retrievalDate)               e.retrieval_date     = 'Retrieval date is required.';
      }
      if (!retrievalDelivery)           e.retrieval_delivery = 'Please choose a delivery method.';
      if (retrievalDelivery === 'home' || retrievalDelivery === 'office') {
        if (!deliveryDistance)                    e.retrieval_distance = 'Please select your distance range.';
        if (!retrievalDeliveryStreet.trim())      e.retrieval_address  = 'Delivery address is required.';
      }
    }

    if (has('submission') || has('retrieval')) {
      if (!isCompanyDocument) {
        e.docCategory = 'Please select whether this is a company or personal document.';
      }
    }

    if ((has('submission') || has('retrieval')) && isCompanyDocument === 'company') {
      if (!companyName.trim())   e.company_name     = 'Company name is required.';
      if (!companyCac.trim())    e.company_cac      = 'CAC registration number is required.';
      if (!companyPosition)      e.company_position = 'Please select your position in the company.';
      if (!companyIdCard)        e.company_idCard   = 'Please upload your office ID card.';
      if (!companyAuthMethod)    e.company_auth     = 'Please choose an authorization method.';
      if (companyAuthMethod === 'otp') {
        if (!otpSent)              e.company_auth = 'Please request an OTP first.';
        else if (!otpValue.trim()) e.company_otp  = 'Please enter the OTP you received.';
      }
      if (companyAuthMethod === 'letter' && !companyAuthLetter) {
        e.company_auth = 'Please upload the signed authorization letter.';
      }
    }

    if ((has('submission') || has('retrieval')) && isCompanyDocument) {
      if (!authLetter)            e.auth_letter     = 'Letter of authorization is required.';
      if (!identityType)          e.identity_type   = 'Please select an ID type.';
      if (!identityNumber.trim()) e.identity_number = 'ID number is required.';
      if (!identityImage)         e.identity_image  = 'Please upload your ID image.';
      if (!identitySelfie)        e.identity_selfie = 'Please upload a selfie photo.';
      if (!fullName.trim())       e.info_name       = 'Full name is required.';
      if (!phone.trim())          e.info_phone      = 'Phone number is required.';
      if (!email.trim()) {
        e.info_email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        e.info_email = 'Please enter a valid email address.';
      }
      if (!country)              e.info_country = 'Country is required.';
      if (!stateVal)             e.info_state   = 'State/Province is required.';
      if (!city.trim())          e.info_city    = 'City is required.';
      if (!streetAddress.trim()) e.info_address = 'Street address is required.';
    }

    if (!confirmDetails)   e.confirm_details   = 'Please confirm your details are correct.';
    if (!confirmAuthorize) e.confirm_authorize = 'Please authorize Submitar to act on your behalf.';

    return e;
  }

  useEffect(() => {
    if (submitAttempted) setErrors(validate());
  }, [
    eligibility, primaryService, addOns, receiveMethod, hardcopyDeliveryType,
    uploadFile, docType, docText,
    pickupAddress, pickupDate, pickupTime, pickupContact, pickupPhone,
    courierCompany, courierTracking,
    submissionLocation, submissionDate, wantsFollowUp, followUpFrequency,
    followupDate, followupLocation,
    repOrg, repPurpose,
    retrievalItem, retrievalLocationVal, retrievalDate,
    retrievalDelivery, deliveryDistance, retrievalDeliveryStreet,
    isCompanyDocument, companyName, companyCac, companyPosition,
    companyIdCard, companyAuthMethod, otpSent, otpValue, companyAuthLetter,
    authLetter, identityType, identityNumber, identityImage, identitySelfie,
    fullName, phone, email, country, stateVal, city, streetAddress,
    confirmDetails, confirmAuthorize, submitAttempted,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    try {
      // Build FormData for multipart submission (includes file uploads)
      const formData = new FormData();
      
      // Core service info
      formData.append('primaryService', primaryService);
      formData.append('addOns', JSON.stringify(addOns));
      formData.append('receiveMethod', receiveMethod);
      formData.append('lineItems', JSON.stringify(lineItems));
      formData.append('total', total.toString());
      
      // Document upload fields
      if (receiveMethod === 'upload') {
        formData.append('uploadDesc', uploadDesc);
        formData.append('docType', docType);
        formData.append('docText', docText);
        formData.append('formattingStyle', formattingStyle);
        if (uploadFile) formData.append('uploadFile', uploadFile);
      }
      
      // Hardcopy delivery
      if (receiveMethod === 'hardcopy') {
        formData.append('hardcopyDeliveryType', hardcopyDeliveryType);
        if (hardcopyDeliveryType === 'personal') {
          formData.append('pickupAddress', pickupAddress);
          formData.append('pickupDate', pickupDate);
          formData.append('pickupTime', pickupTime);
          formData.append('pickupContact', pickupContact);
          formData.append('pickupPhone', pickupPhone);
          formData.append('pickupNumDocs', pickupNumDocs);
          formData.append('pickupInstructions', pickupInstructions);
        } else if (hardcopyDeliveryType === 'courier') {
          formData.append('courierCompany', courierCompany);
          formData.append('courierTracking', courierTracking);
          formData.append('courierContact', courierContact);
          formData.append('courierPickupLocation', courierPickupLocation);
          formData.append('courierInstructions', courierInstructions);
        }
      }
      
      // Submission details
      if (has('submission')) {
        formData.append('submissionLocation', submissionLocation);
        formData.append('submissionDate', submissionDate);
        formData.append('submissionInstructions', submissionInstructions);
      }
      
      // Follow-up details
      if (wantsFollowUp === 'yes' || primaryService === 'followup') {
        formData.append('wantsFollowUp', 'yes');
        formData.append('followUpFrequency', followUpFrequency);
        formData.append('followupDate', followupDate);
        formData.append('followupLocation', followupLocation);
        formData.append('followupStatus', followupStatus);
        formData.append('followupRef', followupRef);
      }
      
      // Representation details
      if (has('representation')) {
        formData.append('repOrg', repOrg);
        formData.append('repOrgStreet', repOrgStreet);
        formData.append('repOrgCity', repOrgCity);
        formData.append('repOrgState', repOrgState);
        formData.append('repOrgCountry', repOrgCountry);
        formData.append('repOrgLandmark', repOrgLandmark);
        formData.append('repGender', repGender);
        formData.append('repPurpose', repPurpose);
        formData.append('repTopic', repTopic);
        formData.append('repScript', repScript);
        if (repFile) formData.append('repFile', repFile);
      }
      
      // Retrieval details
      if (has('retrieval')) {
        formData.append('retrievalItem', retrievalItem);
        formData.append('retrievalLocationVal', retrievalLocationVal);
        formData.append('retrievalLocStreet', retrievalLocStreet);
        formData.append('retrievalLocCity', retrievalLocCity);
        formData.append('retrievalLocState', retrievalLocState);
        formData.append('retrievalLocCountry', retrievalLocCountry);
        formData.append('retrievalDate', retrievalDate);
        formData.append('retrievalStatus', retrievalStatus);
        formData.append('retrievalDelivery', retrievalDelivery);
        formData.append('deliveryDistance', deliveryDistance);
        formData.append('retrievalDeliveryStreet', retrievalDeliveryStreet);
        formData.append('retrievalDeliveryCity', retrievalDeliveryCity);
        formData.append('retrievalDeliveryState', retrievalDeliveryState);
        formData.append('retrievalDeliveryCountry', retrievalDeliveryCountry);
      }
      
      // Company document verification
      if (isCompanyDocument === 'company') {
        formData.append('isCompanyDocument', 'company');
        formData.append('companyName', companyName);
        formData.append('companyCac', companyCac);
        formData.append('companyPosition', companyPosition);
        formData.append('companyAuthMethod', companyAuthMethod);
        if (companyIdCard) formData.append('companyIdCard', companyIdCard);
        if (companyAuthLetter) formData.append('companyAuthLetter', companyAuthLetter);
        formData.append('companyStreet', companyStreet);
        formData.append('companyCity', companyCity);
        formData.append('companyState', '');
        formData.append('companyCountry', companyCountry);
      } else if (isCompanyDocument === 'personal') {
        formData.append('isCompanyDocument', 'personal');
        formData.append('identityType', identityType);
        formData.append('identityNumber', identityNumber);
      }
      
      // Contact info
      formData.append('fullName', fullName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('country', country);
      formData.append('stateVal', stateVal);
      formData.append('city', city);
      formData.append('streetAddress', streetAddress);
      
      // Submit to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Save to sessionStorage and redirect
      sessionStorage.setItem('orderReview', JSON.stringify({
        csn: data.csn,
        lineItems,
        total,
        fullName,
        phone,
        email,
        streetAddress,
        city,
      }));
      
      window.location.href = '/review';
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  // ─── Order summary ────────────────────────────────────────────────────────
  const { lineItems, total } = useMemo<{ lineItems: LineItem[]; total: number }>(() => {
    const items: LineItem[] = [];
    const hasInlineFollowUp = primaryService === 'submission' && wantsFollowUp === 'yes' && followUpFrequency !== '';

    if (primaryService === 'submission') {
      if (hasInlineFollowUp) {
        if (followUpFrequency === 'single')   items.push({ label: 'Submission + Single Follow-Up Check', amount: PRICES.submission_followup_single, note: 'Bundled — saves ₦5,000' });
        if (followUpFrequency === 'biweekly') items.push({ label: 'Submission + Follow-Up (Bi-weekly)', amount: PRICES.submission_followup_biweekly, note: 'Bundled — saves ₦15,000' });
        if (followUpFrequency === 'thrice')   items.push({ label: 'Submission + Follow-Up (3 Checks)', amount: PRICES.submission_followup_thrice, note: 'Bundled — saves ₦30,000' });
        if (followUpFrequency === 'weekly4')  items.push({ label: 'Submission + Follow-Up (Weekly × 4)', amount: PRICES.submission_followup_weekly4, note: 'Bundled — saves ₦50,000' });
      } else {
        items.push({ label: 'Submission Only', amount: PRICES.submission });
      }
    }

    if (primaryService === 'followup') {
      if (followUpFrequency === 'single') {
        items.push({ label: 'Follow-Up (Single Check)', amount: PRICES.followup_single });
      } else if (followUpFrequency === 'biweekly') {
        items.push({ label: 'Follow-Up (Bi-weekly)', amount: PRICES.followup_biweekly });
      } else if (followUpFrequency === 'thrice') {
        items.push({ label: 'Follow-Up (3 Checks)', amount: PRICES.followup_thrice });
      } else if (followUpFrequency === 'weekly4') {
        items.push({ label: 'Follow-Up (Weekly × 4)', amount: PRICES.followup_weekly4 });
      } else {
        items.push({ label: 'Follow-Up (Standalone)', amount: PRICES.followup_standalone });
      }
    }

    if (has('representation')) {
      const isSpeaking = repPurpose === 'speaking';
      items.push({
        label: isSpeaking ? 'Representation + Speaking' : 'Basic Representation',
        amount: isSpeaking ? PRICES.representation_speaking : PRICES.representation_attendance,
        note: isSpeaking ? undefined : 'Per 2-hour session',
      });
    }

    if (has('retrieval')) {
      items.push({ label: 'Document Retrieval', amount: PRICES.retrieval });
      if ((retrievalDelivery === 'home' || retrievalDelivery === 'office') && deliveryDistance) {
        const fee = DELIVERY_FEES[deliveryDistance];
        if (fee) items.push({ label: fee.label, amount: fee.amount, note: 'Distance-based delivery fee' });
      }
    }

    return { lineItems: items, total: items.reduce((s, i) => s + i.amount, 0) };
  }, [primaryService, addOns, repPurpose, wantsFollowUp, followUpFrequency, retrievalDelivery, deliveryDistance]);

  const secondaryOptions = SECONDARY_OPTIONS[primaryService] ?? [];
  const needsDocCategory = has('submission') || has('retrieval');
  const needsAuthSection = needsDocCategory && (isCompanyDocument === 'company' || isCompanyDocument === 'personal');

  // ─── Shared representation details block ─────────────────────────────────
  const RepresentationDetails = ({ isAddOn = false }: { isAddOn?: boolean }) => (
    <div className="space-y-4 mt-4 pt-4 border-t border-blue-100">
      {!isAddOn && (
        <>
          <input type="text" placeholder="Organization / Office Name" value={repOrg}
            onChange={e => setRepOrg(e.target.value)} data-error={!!errors.rep_org}
            className={`w-full border p-3 text-sm ${errBorder(errors.rep_org)}`} />
          <FieldError msg={errors.rep_org} />

          <p className="text-sm font-bold text-gray-700">Organization Address</p>
          <AddressBlock
            streetAddress={repOrgStreet} setStreetAddress={setRepOrgStreet}
            city={repOrgCity} setCity={setRepOrgCity}
            country={repOrgCountry} setCountry={setRepOrgCountry}
            stateVal={repOrgState} setStateVal={setRepOrgState}
            landmark={repOrgLandmark} setLandmark={setRepOrgLandmark}
            compact
          />
        </>
      )}
      {isAddOn && (
        <p className="text-xs text-gray-500 italic bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
          📍 Representative will attend the same office address entered above.
        </p>
      )}

      <p className="text-sm font-bold pt-2">Preferred Representative:</p>
      <div className="flex gap-6">
        {['Male', 'Female', 'No preference'].map(g => (
          <label key={g} className="flex items-center gap-2">
            <input type="radio" name="rep" checked={repGender === g} onChange={() => setRepGender(g)} /> {g}
          </label>
        ))}
      </div>
      <p className="text-sm font-bold">Purpose:</p>
      <div className="flex gap-6" data-error={!!errors.rep_purpose}>
        <label className="flex items-center gap-2">
          <input type="radio" name="purpose" checked={repPurpose === 'attendance'} onChange={() => setRepPurpose('attendance')} />
          Attendance only <span className="text-xs text-blue-600 font-semibold ml-1">(₦50,000)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="purpose" checked={repPurpose === 'speaking'} onChange={() => setRepPurpose('speaking')} />
          Representation + Speaking <span className="text-xs text-blue-600 font-semibold ml-1">(₦100,000)</span>
        </label>
      </div>
      <FieldError msg={errors.rep_purpose} />
      {repPurpose === 'speaking' && (
        <>
          <input type="text" placeholder="Topic/Subject" value={repTopic}
            onChange={e => setRepTopic(e.target.value)} className="w-full border p-3 text-sm" />
          <textarea placeholder="Breakdown of what to say" value={repScript}
            onChange={e => setRepScript(e.target.value)} className="w-full border p-3 text-sm" rows={3} />
          <input type="file" onChange={e => setRepFile(e.target.files?.[0] ?? null)} className="w-full border p-2" />
        </>
      )}
    </div>
  );

  // ─── Shared retrieval details block ──────────────────────────────────────
  const RetrievalDetails = ({ isAddOn = false }: { isAddOn?: boolean }) => (
    <div className="space-y-4 mt-4 pt-4 border-t border-blue-100">
      <input type="text" placeholder="What are we retrieving?" value={retrievalItem}
        onChange={e => setRetrievalItem(e.target.value)} data-error={!!errors.retrieval_item}
        className={`w-full border p-3 text-sm ${errBorder(errors.retrieval_item)}`} />
      <FieldError msg={errors.retrieval_item} />

      {!isAddOn && (
        <>
          <input type="text" placeholder="Name of location (office / agency)" value={retrievalLocationVal}
            onChange={e => setRetrievalLocationVal(e.target.value)} data-error={!!errors.retrieval_location}
            className={`w-full border p-3 text-sm ${errBorder(errors.retrieval_location)}`} />
          <FieldError msg={errors.retrieval_location} />

          <p className="text-sm font-bold text-gray-700">Retrieval Location Address</p>
          <AddressBlock
            streetAddress={retrievalLocStreet} setStreetAddress={setRetrievalLocStreet}
            city={retrievalLocCity} setCity={setRetrievalLocCity}
            country={retrievalLocCountry} setCountry={setRetrievalLocCountry}
            stateVal={retrievalLocState} setStateVal={setRetrievalLocState}
            compact
          />
        </>
      )}
      {isAddOn && (
        <p className="text-xs text-gray-500 italic bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
          📍 Document will be retrieved from the same office address entered above.
        </p>
      )}

      <input type="date" value={retrievalDate} onChange={e => setRetrievalDate(e.target.value)}
        data-error={!!errors.retrieval_date}
        className={`w-full border p-3 text-sm ${errBorder(errors.retrieval_date)}`} />
      <FieldError msg={errors.retrieval_date} />
      <input type="text" placeholder="Last update/status" value={retrievalStatus}
        onChange={e => setRetrievalStatus(e.target.value)} className="w-full border p-3 text-sm" />

      <p className="text-sm font-bold">How would you like to receive your document?</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-error={!!errors.retrieval_delivery}>
        {[{ id: 'home', label: 'Home Delivery' }, { id: 'office', label: 'Office Delivery' }, { id: 'pickup', label: 'Pickup' }].map(opt => (
          <label key={opt.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${retrievalDelivery === opt.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" name="retrieval" checked={retrievalDelivery === opt.id}
              onChange={() => { setRetrievalDelivery(opt.id); setDeliveryDistance(''); }} />
            <span className="text-sm font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      <FieldError msg={errors.retrieval_delivery} />

      {(retrievalDelivery === 'home' || retrievalDelivery === 'office') && (
        <div className="space-y-3 pt-2">
          <p className="text-sm font-bold text-gray-700">
            {retrievalDelivery === 'home' ? 'Home' : 'Office'} Delivery Address
          </p>
          <AddressBlock
            streetAddress={retrievalDeliveryStreet} setStreetAddress={setRetrievalDeliveryStreet}
            city={retrievalDeliveryCity} setCity={setRetrievalDeliveryCity}
            country={retrievalDeliveryCountry} setCountry={setRetrievalDeliveryCountry}
            stateVal={retrievalDeliveryState} setStateVal={setRetrievalDeliveryState}
            errors={{ street: errors.retrieval_address }}
            compact
          />
          <div data-error={!!errors.retrieval_distance}>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Approximate distance from retrieval point</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'within5', label: '0 – 5 km',   fee: '₦2,000'  },
                { id: '5to15',   label: '5 – 15 km',  fee: '₦5,000'  },
                { id: '15to30',  label: '15 – 30 km', fee: '₦10,000' },
                { id: 'above30', label: '30+ km',     fee: '₦15,000' },
              ].map(d => (
                <label key={d.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${deliveryDistance === d.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="deliveryDist" checked={deliveryDistance === d.id} onChange={() => setDeliveryDistance(d.id)} />
                    <span className="text-sm font-medium text-gray-800">{d.label}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">{d.fee}</span>
                </label>
              ))}
            </div>
            <FieldError msg={errors.retrieval_distance} />
            <p className="text-[10px] text-gray-400 mt-1">Delivery fee is added to your order total.</p>
          </div>
        </div>
      )}
      {retrievalDelivery === 'pickup' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-medium">You will be notified when your document is ready for pickup. No delivery fee applies.</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen pb-20">
        <div className="max-w-2xl mx-auto py-10 px-6 text-gray-800">

         <div className="mb-8">
  <button 
    type="button"
    onClick={() => window.location.href = '/'}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors px-5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    ← Back
  </button>
</div>

          <header className="mb-10 border-b pb-6">
            <h1 className="text-3xl font-semibold text-black">Submitar Service Request Form</h1>
          </header>

          <form className="space-y-10" onSubmit={handleSubmit} noValidate>

            {/* ── 0. Eligibility ─────────────────────────────────────────── */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg uppercase tracking-wide underline">
                0. Service Eligibility Check (MANDATORY)
              </h2>
              <p className="text-sm font-medium">
                Is this request related to a legally mandated, court-compulsory, or government-enforced process?
              </p>
              <div className="grid grid-cols-1 gap-3" data-error={!!errors.eligibility}>
                {[
                  { val: 'yes', label: 'Yes, it is legally mandated / court-compulsory', cls: eligibility === 'yes' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300' },
                  { val: 'no',  label: 'No, it is a general/non-mandated service',        cls: eligibility === 'no'  ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300' },
                ].map(o => (
                  <label key={o.val} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${o.cls}`}>
                    <input type="radio" checked={eligibility === o.val} onChange={() => setEligibility(o.val)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              <FieldError msg={errors.eligibility} />

              {eligibility === 'yes' && (
                <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdWarning className="text-red-600 text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-700 mb-2">Service Not Available</h3>
                      <p className="text-gray-700">
                        We are sorry. Submitar does not provide legal representative services for legally mandated,
                        court-compulsory, or government-enforced processes.
                      </p>
                      <p className="mt-3 text-gray-600">Please contact a licensed legal practitioner or the appropriate authority.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {eligibility === 'no' && (
              <>
                {/* ── 1. Select Primary Service ─────────────────────────── */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-bold text-lg">1. Select Your Primary Service</h3>
                  <p className="text-sm text-gray-500">Choose one main service. You can add more options below.</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    {[
                      { label: 'Submission',    price: '₦35,000' },
                      { label: 'Follow-Up',      price: '₦35,000' },
                      { label: 'Representation', price: '₦50–100k' },
                      { label: 'Retrieval',      price: '₦35,000' },
                    ].map(h => (
                      <div key={h.label} className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{h.label}</p>
                        <p className="font-bold text-blue-700 text-sm">{h.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                    <MdLightbulb className="text-amber-500 text-base shrink-0" />
                    <span><strong>Bundle deal:</strong> Select Submission + Follow-up and pay just ₦120,000 (saves ₦50,000)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-error={!!errors.primaryService}>
                    {PRIMARY_SERVICES.map(service => {
                      const Icon = service.icon;
                      const isSelected = primaryService === service.id;
                      return (
                        <label
                          key={service.id}
                          className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <input
                            type="radio"
                            name="primaryService"
                            checked={isSelected}
                            onChange={() => setPrimaryService(service.id)}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <Icon className="text-xl text-blue-600" />
                            <div>
                              <p className="font-semibold text-sm">{service.label}</p>
                              <p className="text-xs text-blue-600 font-bold">{service.price}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError msg={errors.primaryService} />
                </div>

                {/* ── 2. Receive Document ───────────────────────────────── */}
                {has('submission') && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">2. How Should We Receive Your Document?</h3>
                    <div className="flex border-b border-gray-200">
                      {[
                        { id: 'upload',   label: 'Upload Document',          Icon: MdUpload },
                        { id: 'text',     label: 'Send Text for Typesetting', Icon: MdTextFields },
                        { id: 'hardcopy', label: 'Hardcopy Pickup',           Icon: MdLocalShipping },
                      ].map(tab => (
                        <button key={tab.id} type="button"
                          onClick={() => setReceiveMethod(tab.id as typeof receiveMethod)}
                          className={`flex-1 py-3 text-sm font-medium border-b-2 flex items-center justify-center gap-2 ${receiveMethod === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                          <tab.Icon className="text-lg" /> {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="pt-4">
                      {receiveMethod === 'upload' && (
                        <div className="space-y-3">
                          <label className="text-xs font-bold block">Upload File(s)</label>
                          <input type="file" data-error={!!errors.receiveMethod_file}
                            onChange={e => setUploadFile(e.target.files?.[0] ?? null)}
                            className={`w-full border p-2 ${errBorder(errors.receiveMethod_file)}`} />
                          <FieldError msg={errors.receiveMethod_file} />
                          <input type="text" placeholder="Description" value={uploadDesc}
                            onChange={e => setUploadDesc(e.target.value)} className="w-full border p-2 text-sm" />
                        </div>
                      )}

                      {receiveMethod === 'text' && (
                        <div className="space-y-4">
                          <input type="text" placeholder="Type of Document (Letter, CV, etc.)" value={docType}
                            onChange={e => setDocType(e.target.value)} data-error={!!errors.receiveMethod_docType}
                            className={`w-full border p-2 text-sm ${errBorder(errors.receiveMethod_docType)}`} />
                          <FieldError msg={errors.receiveMethod_docType} />
                          <textarea placeholder="Paste Text Here" value={docText}
                            onChange={e => setDocText(e.target.value)} data-error={!!errors.receiveMethod_text}
                            className={`w-full border p-2 text-sm ${errBorder(errors.receiveMethod_text)}`} rows={5} />
                          <FieldError msg={errors.receiveMethod_text} />
                          <p className="text-xs font-bold">Formatting Style:</p>
                          <div className="flex gap-6">
                            {['Formal', 'Simple', 'Professional'].map(s => (
                              <label key={s} className="flex items-center gap-2">
                                <input type="radio" name="style" checked={formattingStyle === s} onChange={() => setFormattingStyle(s)} /> {s}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {receiveMethod === 'hardcopy' && (
                        <div className="space-y-6">
                          {/* Delivery Type Selection */}
                          <div data-error={!!errors.receiveMethod_hardcopyDeliveryType}>
                            <p className="text-sm font-bold mb-3">Choose Delivery Method</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${hardcopyDeliveryType === 'personal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input 
                                  type="radio" 
                                  name="hardcopyDeliveryType" 
                                  checked={hardcopyDeliveryType === 'personal'} 
                                  onChange={() => setHardcopyDeliveryType('personal')} 
                                />
                                <div>
                                  <p className="font-semibold">Personal Pickup</p>
                                  <p className="text-xs text-gray-500">Submitar team will come to your location to pick up the document.</p>
                                </div>
                              </label>

                              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${hardcopyDeliveryType === 'courier' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input 
                                  type="radio" 
                                  name="hardcopyDeliveryType" 
                                  checked={hardcopyDeliveryType === 'courier'} 
                                  onChange={() => setHardcopyDeliveryType('courier')} 
                                />
                                <div>
                                  <p className="font-semibold">Courier Delivery</p>
                                  <p className="text-xs text-gray-500">You have already sent it via courier service.</p>
                                </div>
                              </label>
                            </div>
                            <FieldError msg={errors.receiveMethod_hardcopyDeliveryType} />
                          </div>

                          {/* Personal Pickup Fields */}
                          {hardcopyDeliveryType === 'personal' && (
                            <div className="space-y-3 flex flex-col border-t pt-4">
                              <p className="text-sm font-bold text-gray-700">Personal Pickup Details</p>
                              <input type="text" placeholder="Pickup Address" value={pickupAddress}
                                onChange={e => setPickupAddress(e.target.value)} data-error={!!errors.receiveMethod_pickupAddress}
                                className={`w-full border p-3 text-sm ${errBorder(errors.receiveMethod_pickupAddress)}`} />
                              <FieldError msg={errors.receiveMethod_pickupAddress} />

                              <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)}
                                data-error={!!errors.receiveMethod_pickupDate}
                                className={`w-full border p-3 text-sm ${errBorder(errors.receiveMethod_pickupDate)}`} />
                              <FieldError msg={errors.receiveMethod_pickupDate} />

                              <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)}
                                data-error={!!errors.receiveMethod_pickupTime}
                                className={`w-full border p-3 text-sm ${errBorder(errors.receiveMethod_pickupTime)}`} />
                              <FieldError msg={errors.receiveMethod_pickupTime} />

                              <input type="text" placeholder="Contact Person Name" value={pickupContact}
                                onChange={e => setPickupContact(e.target.value)} data-error={!!errors.receiveMethod_pickupContact}
                                className={`w-full border p-3 text-sm ${errBorder(errors.receiveMethod_pickupContact)}`} />
                              <FieldError msg={errors.receiveMethod_pickupContact} />

                              <input type="tel" placeholder="Phone Number" value={pickupPhone}
                                onChange={e => setPickupPhone(e.target.value)} data-error={!!errors.receiveMethod_pickupPhone}
                                className={`w-full border p-3 text-sm ${errBorder(errors.receiveMethod_pickupPhone)}`} />
                              <FieldError msg={errors.receiveMethod_pickupPhone} />

                              <input type="number" placeholder="Number of Documents" value={pickupNumDocs}
                                onChange={e => setPickupNumDocs(e.target.value)} className="w-full border p-3 text-sm" />

                              <textarea placeholder="Additional Instructions (Optional)" value={pickupInstructions}
                                onChange={e => setPickupInstructions(e.target.value)} className="w-full border p-3 text-sm" rows={3} />
                            </div>
                          )}

                          {/* Courier Fields */}
                          {hardcopyDeliveryType === 'courier' && (
                            <div className="space-y-4 border-t pt-4">
                              <p className="text-sm font-bold text-gray-700">Courier Details</p>
                              
                              <div>
                                <label className="text-xs font-bold block mb-1">Company / Platform Name <span className="text-red-500">*</span></label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. GIG, DHL, FedEx, UPS, etc." 
                                  value={courierCompany}
                                  onChange={e => setCourierCompany(e.target.value)} 
                                  data-error={!!errors.receiveMethod_courierCompany}
                                  className={`w-full border p-3 text-sm ${errBorder(errors.receiveMethod_courierCompany)}`} 
                                />
                                <FieldError msg={errors.receiveMethod_courierCompany} />
                              </div>

                              <div>
                                <label className="text-xs font-bold block mb-1">Order / Tracking Number <span className="text-red-500">*</span></label>
                                <input 
                                  type="text" 
                                  placeholder="Enter tracking number" 
                                  value={courierTracking}
                                  onChange={e => setCourierTracking(e.target.value)} 
                                  data-error={!!errors.receiveMethod_courierTracking}
                                  className={`w-full border p-3 text-sm ${errBorder(errors.receiveMethod_courierTracking)}`} 
                                />
                                <FieldError msg={errors.receiveMethod_courierTracking} />
                              </div>

                              <div>
                                <label className="text-xs font-bold block mb-1">Company Contact Number (Optional)</label>
                                <input 
                                  type="tel" 
                                  placeholder="Courier company phone number" 
                                  value={courierContact}
                                  onChange={e => setCourierContact(e.target.value)} 
                                  className="w-full border p-3 text-sm" 
                                />
                              </div>

                              <div>
                                <label className="text-xs font-bold block mb-1">Pickup Location / Branch (Optional)</label>
                                <input 
                                  type="text" 
                                  placeholder="Branch name or location" 
                                  value={courierPickupLocation}
                                  onChange={e => setCourierPickupLocation(e.target.value)} 
                                  className="w-full border p-3 text-sm" 
                                />
                              </div>

                              <div>
                                <label className="text-xs font-bold block mb-1">Additional Instructions (Optional)</label>
                                <textarea 
                                  placeholder="Any special notes for the courier document..." 
                                  value={courierInstructions}
                                  onChange={e => setCourierInstructions(e.target.value)} 
                                  className="w-full border p-3 text-sm" 
                                  rows={3} 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── 3. Submission Details ─────────────────────────────── */}
                {has('submission') && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">3. Submission Details</h3>
                    <input type="text" placeholder="Submission Location (Office/Agency)" value={submissionLocation}
                      onChange={e => setSubmissionLocation(e.target.value)} data-error={!!errors.submission_location}
                      className={`w-full border p-3 text-sm ${errBorder(errors.submission_location)}`} />
                    <FieldError msg={errors.submission_location} />
                    <input type="date" value={submissionDate} onChange={e => setSubmissionDate(e.target.value)}
                      data-error={!!errors.submission_date}
                      className={`w-full border p-3 text-sm ${errBorder(errors.submission_date)}`} />
                    <FieldError msg={errors.submission_date} />
                    <textarea placeholder="Special Instructions" value={submissionInstructions}
                      onChange={e => setSubmissionInstructions(e.target.value)} className="w-full border p-3 text-sm" />

                    {/* Inline follow-up upsell */}
                    <div className="mt-2 border border-blue-100 rounded-xl p-4 bg-blue-50 space-y-4">
                      <div>
                        <p className="font-bold text-sm text-gray-800">Would you like us to follow up on this submission?</p>
                        <p className="text-xs text-gray-500 mt-0.5">We track progress and send you updates after submission.</p>
                      </div>
                      <div className="flex gap-3">
                        <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer text-sm font-semibold transition-all ${wantsFollowUp === 'yes' ? 'border-blue-600 bg-white text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                          <input type="radio" name="inlineFollowup" className="hidden" checked={wantsFollowUp === 'yes'} onChange={() => setWantsFollowUp('yes')} />
                          Yes, follow up for me
                        </label>
                        <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer text-sm font-semibold transition-all ${wantsFollowUp === 'no' ? 'border-gray-400 bg-white text-gray-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                          <input type="radio" name="inlineFollowup" className="hidden" checked={wantsFollowUp === 'no'} onChange={() => { setWantsFollowUp('no'); setFollowUpFrequency(''); }} />
                          No, not needed
                        </label>
                      </div>
                      {wantsFollowUp === 'yes' && (
                        <div className="space-y-2 pt-1" data-error={!!errors.followup_frequency}>
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">How often should we check in?</p>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { id: 'single',   title: 'Single Check',          sub: 'One status check after submission', price: '₦65,000',  saving: 'Saves ₦5,000'  },
                              { id: 'biweekly', title: 'Bi-weekly — 2 Checks', sub: 'Update every two weeks',            price: '₦90,000',  saving: 'Saves ₦15,000' },
                              { id: 'thrice',   title: 'Thrice — 3 Checks',    sub: 'Three status checks',                price: '₦105,000', saving: 'Saves ₦30,000' },
                              { id: 'weekly4',  title: 'Weekly — 4 Weeks',     sub: 'Update every week for a month',     price: '₦120,000', saving: 'Saves ₦50,000' },
                            ].map(opt => (
                              <label key={opt.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all bg-white ${followUpFrequency === opt.id ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center gap-3">
                                  <input type="radio" name="followupFreq" checked={followUpFrequency === opt.id} onChange={() => setFollowUpFrequency(opt.id)} />
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{opt.title}</p>
                                    <p className="text-xs text-gray-500">{opt.sub}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-blue-700">{opt.price}</p>
                                  <p className="text-[10px] text-green-600 font-medium">{opt.saving}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                          <FieldError msg={errors.followup_frequency} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Standalone Follow-up Details ──────────────────────── */}
                {primaryService === 'followup' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">2. Follow-up Details</h3>
                    <input type="date" placeholder="When was the document submitted?" value={followupDate}
                      onChange={e => setFollowupDate(e.target.value)} data-error={!!errors.followup_date}
                      className={`w-full border p-3 text-sm ${errBorder(errors.followup_date)}`} />
                    <FieldError msg={errors.followup_date} />
                    <input type="text" placeholder="Where was it submitted?" value={followupLocation}
                      onChange={e => setFollowupLocation(e.target.value)} data-error={!!errors.followup_location}
                      className={`w-full border p-3 text-sm ${errBorder(errors.followup_location)}`} />
                    <FieldError msg={errors.followup_location} />
                    <input type="text" placeholder="What is the last update/status?" value={followupStatus}
                      onChange={e => setFollowupStatus(e.target.value)} className="w-full border p-3 text-sm" />
                    <input type="text" placeholder="Reference Number (if any)" value={followupRef}
                      onChange={e => setFollowupRef(e.target.value)} className="w-full border p-3 text-sm" />

                    {/* Follow-up frequency selector */}
                    <div className="mt-2 border border-blue-100 rounded-xl p-4 bg-blue-50 space-y-3" data-error={!!errors.followup_frequency}>
                      <div>
                        <p className="font-bold text-sm text-gray-800">How often should we check in?</p>
                        <p className="text-xs text-gray-500 mt-0.5">Choose your follow-up cadence.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'single',   title: 'Single Check',          sub: 'One status check',              price: fmt(PRICES.followup_single) },
                          { id: 'biweekly', title: 'Bi-weekly — 2 Checks', sub: 'Update every two weeks',        price: fmt(PRICES.followup_biweekly) },
                          { id: 'thrice',   title: 'Thrice — 3 Checks',    sub: 'Three status checks',            price: fmt(PRICES.followup_thrice) },
                          { id: 'weekly4',  title: 'Weekly — 4 Weeks',     sub: 'Update every week for a month', price: fmt(PRICES.followup_weekly4) },
                        ].map(opt => (
                          <label key={opt.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all bg-white ${followUpFrequency === opt.id ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="flex items-center gap-3">
                              <input type="radio" name="standaloneFollowupFreq" checked={followUpFrequency === opt.id} onChange={() => setFollowUpFrequency(opt.id)} />
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{opt.title}</p>
                                <p className="text-xs text-gray-500">{opt.sub}</p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-blue-700">{opt.price}</p>
                          </label>
                        ))}
                      </div>
                      <FieldError msg={errors.followup_frequency} />
                    </div>
                  </div>
                )}

                {primaryService === 'representation' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">2. Representation Details</h3>
                    <RepresentationDetails />
                  </div>
                )}

                {primaryService === 'retrieval' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">2. Retrieval Details</h3>
                    <RetrievalDetails />
                  </div>
                )}

                {/* ── Secondary Service Upsells ─────────────────────────── */}
                {primaryService && secondaryOptions.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">Would You Like to Add Any of These?</h3>
                    <p className="text-sm text-gray-500">These optional services can be bundled with your {primaryService} request.</p>
                    <div className="grid grid-cols-1 gap-3">
                      {secondaryOptions.map(opt => {
                        const isChosen = addOns.includes(opt.id);
                        return (
                          <div key={opt.id}>
                            <label
                              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${isChosen ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                            >
                              <input
                                type="checkbox"
                                checked={isChosen}
                                onChange={() => toggleAddOn(opt.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                                  <span className="text-sm font-bold text-blue-600">{opt.price}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                              </div>
                            </label>

                            {isChosen && opt.id === 'representation' && (
                              <div className="border-2 border-blue-200 border-t-0 rounded-b-xl bg-blue-50/40 px-4 pb-4">
                                <RepresentationDetails isAddOn />
                              </div>
                            )}
                            {isChosen && opt.id === 'retrieval' && (
                              <div className="border-2 border-blue-200 border-t-0 rounded-b-xl bg-blue-50/40 px-4 pb-4">
                                <RetrievalDetails isAddOn />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Document Category ──────────────────────────────────── */}
                {needsDocCategory && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">Document Category</h3>
                    <p className="text-sm">Is this a Company Document or Personal Document?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-error={!!errors.docCategory}>
                      <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${isCompanyDocument === 'company' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                        <input type="radio" name="docCategory" checked={isCompanyDocument === 'company'} onChange={() => setIsCompanyDocument('company')} />
                        <FaBuilding className="text-blue-500" /> <span>Company Document</span>
                      </label>
                      <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${isCompanyDocument === 'personal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                        <input type="radio" name="docCategory" checked={isCompanyDocument === 'personal'} onChange={() => setIsCompanyDocument('personal')} />
                        <FaUser className="text-blue-500" /> <span>Personal / Individual</span>
                      </label>
                    </div>
                    <FieldError msg={errors.docCategory} />
                  </div>
                )}

                {/* ── Company Verification ───────────────────────────────── */}
                {needsDocCategory && isCompanyDocument === 'company' && (
                  <div className="space-y-4 pt-4 border-t bg-gray-50 p-4 rounded">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FaBuilding /> Company Verification</h3>
                    <input type="text" placeholder="Company Name" value={companyName}
                      onChange={e => setCompanyName(e.target.value)} data-error={!!errors.company_name}
                      className={`w-full border p-3 text-sm bg-white ${errBorder(errors.company_name)}`} />
                    <FieldError msg={errors.company_name} />
                    <input type="text" placeholder="Company Registration Number (CAC)" value={companyCac}
                      onChange={e => setCompanyCac(e.target.value)} data-error={!!errors.company_cac}
                      className={`w-full border p-3 text-sm bg-white ${errBorder(errors.company_cac)}`} />
                    <FieldError msg={errors.company_cac} />

                    <p className="text-sm font-bold">Company Address</p>
                    <AddressBlock
                      streetAddress={companyStreet} setStreetAddress={setCompanyStreet}
                      city={companyCity} setCity={setCompanyCity}
                      country={companyCountry} setCountry={setCompanyCountry}
                      stateVal={companyState} setStateVal={setCompanyState}
                    />

                    <p className="text-sm font-bold pt-2">Your Position in the Company:</p>
                    <div className="flex flex-wrap gap-6" data-error={!!errors.company_position}>
                      {['Director', 'Manager', 'Staff', 'Other'].map(pos => (
                        <label key={pos} className="flex items-center gap-2">
                          <input type="radio" name="pos" checked={companyPosition === pos} onChange={() => setCompanyPosition(pos)} /> {pos}
                        </label>
                      ))}
                    </div>
                    <FieldError msg={errors.company_position} />
                    <label className="text-xs font-bold block">Upload Office ID Card</label>
                    <input type="file" data-error={!!errors.company_idCard}
                      onChange={e => setCompanyIdCard(e.target.files?.[0] ?? null)}
                      className={`w-full border p-2 bg-white ${errBorder(errors.company_idCard)}`} />
                    <FieldError msg={errors.company_idCard} />
                    <p className="font-bold text-sm underline pt-4">Company Authorization Method</p>
                    <div data-error={!!errors.company_auth}>
                      <label className="flex items-center gap-2 font-medium text-sm">
                        <input type="radio" name="c-auth" checked={companyAuthMethod === 'otp'}
                          onChange={() => { setCompanyAuthMethod('otp'); setOtpSent(null); }} />
                        Verify via OTP (pulled from CAC records)
                      </label>
                      {companyAuthMethod === 'otp' && (
                        <div className="pl-6 space-y-3 mt-2">
                          <p className="text-xs text-gray-500">Your registered contact details will be retrieved automatically from the CAC database.</p>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setOtpSent('email')}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-semibold transition-all ${otpSent === 'email' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}>
                              <MdEmail className="text-base" /> Get OTP via Email
                            </button>
                            <button type="button" onClick={() => setOtpSent('mobile')}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-semibold transition-all ${otpSent === 'mobile' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}>
                              <MdPhone className="text-base" /> Get OTP via Mobile
                            </button>
                          </div>
                          {otpSent && (
                            <div className="space-y-2">
                              <p className="text-xs text-green-700 font-medium">OTP sent to your CAC-registered {otpSent === 'email' ? 'email address' : 'mobile number'}.</p>
                              <input type="text" placeholder="Enter OTP" value={otpValue}
                                onChange={e => setOtpValue(e.target.value)} data-error={!!errors.company_otp}
                                className={`w-full border p-2 text-sm bg-white ${errBorder(errors.company_otp)}`} />
                              <FieldError msg={errors.company_otp} />
                            </div>
                          )}
                        </div>
                      )}
                      <label className="flex items-center gap-2 mt-4 font-medium text-sm">
                        <input type="radio" name="c-auth" checked={companyAuthMethod === 'letter'}
                          onChange={() => { setCompanyAuthMethod('letter'); setOtpSent(null); }} />
                        Upload Signed / Stamped Authorization Letter
                      </label>
                      {companyAuthMethod === 'letter' && (
                        <div className="pl-6 mt-2">
                          <input type="file" onChange={e => setCompanyAuthLetter(e.target.files?.[0] ?? null)} className="w-full border p-2 bg-white" />
                        </div>
                      )}
                    </div>
                    <FieldError msg={errors.company_auth} />
                  </div>
                )}

                {/* ── Authorization & Identity ───────────────────────────── */}
                {needsAuthSection && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">Authorization & Identity Verification (REQUIRED)</h3>
                    <p className="text-sm font-bold">Letter of Authorization:</p>
                    <input type="file" data-error={!!errors.auth_letter}
                      onChange={e => setAuthLetter(e.target.files?.[0] ?? null)}
                      className={`w-full border p-2 ${errBorder(errors.auth_letter)}`} />
                    <FieldError msg={errors.auth_letter} />
                    <p className="text-sm font-bold">Identity Verification:</p>
                    <select value={identityType} onChange={e => setIdentityType(e.target.value)}
                      data-error={!!errors.identity_type}
                      className={`w-full border p-3 text-sm ${errBorder(errors.identity_type)}`}>
                      <option value="">Select ID Type...</option>
                      <option value="nin">NIN</option>
                      <option value="passport">International Passport</option>
                    </select>
                    <FieldError msg={errors.identity_type} />
                    <input type="text" placeholder="ID Number" value={identityNumber}
                      onChange={e => setIdentityNumber(e.target.value)} data-error={!!errors.identity_number}
                      className={`w-full border p-3 text-sm ${errBorder(errors.identity_number)}`} />
                    <FieldError msg={errors.identity_number} />
                    <label className="text-xs font-bold block">Upload ID Image</label>
                    <input type="file" data-error={!!errors.identity_image}
                      onChange={e => setIdentityImage(e.target.files?.[0] ?? null)}
                      className={`w-full border p-2 ${errBorder(errors.identity_image)}`} />
                    <FieldError msg={errors.identity_image} />
                    <label className="text-xs font-bold block">Upload Your Photo (Selfie)</label>
                    <input type="file" data-error={!!errors.identity_selfie}
                      onChange={e => setIdentitySelfie(e.target.files?.[0] ?? null)}
                      className={`w-full border p-2 ${errBorder(errors.identity_selfie)}`} />
                    <FieldError msg={errors.identity_selfie} />
                  </div>
                )}

                {/* ── Personal Information ───────────────────────────────── */}
                {needsAuthSection && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">Your Information</h3>
                    <input type="text" placeholder="Full Name" value={fullName}
                      onChange={e => setFullName(e.target.value)} data-error={!!errors.info_name}
                      className={`w-full border p-3 text-sm ${errBorder(errors.info_name)}`} />
                    <FieldError msg={errors.info_name} />
                    <input type="tel" placeholder="Phone Number" value={phone}
                      onChange={e => setPhone(e.target.value)} data-error={!!errors.info_phone}
                      className={`w-full border p-3 text-sm ${errBorder(errors.info_phone)}`} />
                    <FieldError msg={errors.info_phone} />
                    <input type="email" placeholder="Email" value={email}
                      onChange={e => setEmail(e.target.value)} data-error={!!errors.info_email}
                      className={`w-full border p-3 text-sm ${errBorder(errors.info_email)}`} />
                    <FieldError msg={errors.info_email} />

                    <p className="text-sm font-bold">Address</p>
                    <AddressBlock
                      streetAddress={streetAddress} setStreetAddress={setStreetAddress}
                      city={city} setCity={setCity}
                      country={country} setCountry={setCountry}
                      stateVal={stateVal} setStateVal={setStateVal}
                      landmark={landmark} setLandmark={setLandmark}
                      errors={{
                        country: errors.info_country,
                        state: errors.info_state,
                        city: errors.info_city,
                        street: errors.info_address,
                      }}
                    />
                  </div>
                )}

                {/* ── Order Summary ──────────────────────────────────────── */}
                {lineItems.length > 0 && (
                  <div className="pt-6 border-t">
                    <div className="rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
                      <div className="bg-[#0052cc] px-6 py-4 flex items-center justify-between">
                        <h3 className="font-extrabold text-white text-lg tracking-tight">Order Summary</h3>
                        <span className="text-blue-200 text-xs uppercase tracking-widest font-semibold">Estimate</span>
                      </div>
                      <div className="bg-white divide-y divide-gray-100">
                        {lineItems.map((item, i) => (
                          <div key={i} className="px-6 py-4 flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                              {item.note && <p className="text-xs text-green-600 font-medium mt-0.5">{item.note}</p>}
                            </div>
                            <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{fmt(item.amount)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Estimated Total</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Final price confirmed after review</p>
                        </div>
                        <p className="text-2xl font-extrabold text-[#0052cc]">{fmt(total)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Confirmation ───────────────────────────────────────── */}
                <div className="space-y-4 pt-8 border-t">
                  <label className="flex items-center gap-3 p-2 border border-gray-100 rounded">
                    <input type="checkbox" checked={saveRequest} onChange={e => setSaveRequest(e.target.checked)} />
                    <span className="text-sm font-medium">Save this request for future recall</span>
                  </label>

                  <div className="space-y-2 bg-blue-50 p-4 rounded">
                    <p className="text-sm font-bold">Confirmation</p>
                    <label className="flex items-center gap-3" data-error={!!errors.confirm_details}>
                      <input type="checkbox" checked={confirmDetails} onChange={e => setConfirmDetails(e.target.checked)} />
                      <span className="text-sm">I confirm all details are correct</span>
                    </label>
                    <FieldError msg={errors.confirm_details} />
                    <label className="flex items-center gap-3" data-error={!!errors.confirm_authorize}>
                      <input type="checkbox" checked={confirmAuthorize} onChange={e => setConfirmAuthorize(e.target.checked)} />
                      <span className="text-sm">I authorize Submitar to act on my behalf</span>
                    </label>
                    <FieldError msg={errors.confirm_authorize} />
                  </div>

                  {submitAttempted && Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                      <MdWarning className="text-red-500 text-lg shrink-0" />
                      <p className="text-sm text-red-700 font-medium">
                        Please fix the {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} above before submitting.
                      </p>
                    </div>
                  )}

                  <button 
                  type="submit" 
                  className="w-full bg-blue-700 text-white font-bold py-5 rounded-lg text-xl hover:bg-blue-800 transition-colors shadow-lg"
                > 
                  Review Request 
                </button>

                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
