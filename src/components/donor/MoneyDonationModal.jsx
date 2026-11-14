import React, { useState } from 'react';
import {
  IndianRupee,
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  MapPin,
  Lock,
  Printer,
  Compass,
  ArrowRight,
  Heart,
  Phone,
  User,
  Mail,
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { lookupPincode } from '../../utils/pincodeService';

const PRESET_TIERS = [
  { amount: 500, label: '₹500', impact: 'Sponsors 25 meals & clean drinking water' },
  { amount: 1000, label: '₹1,000', impact: 'Sponsors 100 drinking water bottles for shelter families' },
  { amount: 2500, label: '₹2,500', impact: 'Sponsors 10 family first aid & sanitary packs' },
  { amount: 5000, label: '₹5,000', impact: 'Sponsors waterproof tarpaulins & warm blankets' },
  { amount: 10000, label: '₹10,000', impact: 'Sponsors 200 hot meals at camp community kitchen' }
];

export default function MoneyDonationModal({
  onClose,
  defaultCamp = null,
  currentUser = null,
  onDonationComplete,
  initialReceipt = null
}) {
  const { addMonetaryDonation, requests } = useData();

  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const [targetType, setTargetType] = useState(defaultCamp ? 'SPECIFIC_CAMP' : 'NEARBY_CAMP');
  const [selectedCampName, setSelectedCampName] = useState(defaultCamp?.shelterName || defaultCamp?.campName || '');
  const [selectedCampPin, setSelectedCampPin] = useState(defaultCamp?.pincode || '');

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [upiId, setUpiId] = useState('');

  // Donor Details
  const [donorDetails, setDonorDetails] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    pincode: currentUser?.pincode || '',
    panNumber: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState(initialReceipt);

  // Auto-resolve nearest camp from donor's PIN code
  const activePin = (donorDetails.pincode || '').replace(/\D/g, '');
  const nearbyInfo = activePin.length === 6 ? lookupPincode(activePin, requests) : null;

  const currentEffectiveAmount = isCustom ? (parseFloat(customAmount) || 0) : amount;

  const handleSelectTier = (val) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomChange = (val) => {
    setIsCustom(true);
    setCustomAmount(val.replace(/\D/g, ''));
  };

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    if (currentEffectiveAmount < 50) {
      alert('Minimum donation amount is ₹50.');
      return;
    }

    let targetCamp = 'General Disaster Emergency Relief Pool';
    let targetPin = '';

    if (defaultCamp) {
      targetCamp = defaultCamp.shelterName || defaultCamp.campName;
      targetPin = defaultCamp.pincode || '';
    } else if (targetType === 'NEARBY_CAMP' && nearbyInfo?.primaryCamp) {
      targetCamp = nearbyInfo.primaryCamp.name;
      targetPin = nearbyInfo.pincode;
    } else if (targetType === 'SPECIFIC_CAMP' && selectedCampName) {
      targetCamp = selectedCampName;
      targetPin = selectedCampPin;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const receipt = addMonetaryDonation({
        amount: currentEffectiveAmount,
        donorName: donorDetails.name || 'Anonymous Humanitarian Donor',
        donorPhone: donorDetails.phone,
        donorEmail: donorDetails.email,
        pincode: donorDetails.pincode,
        panNumber: donorDetails.panNumber.toUpperCase(),
        targetType: targetType === 'GENERAL' ? 'GENERAL_RELIEF_POOL' : 'SPECIFIC_CAMP',
        targetCampName: targetCamp,
        targetPincode: targetPin,
        paymentMethod,
        purpose: 'Disaster Survival Necessities Sponsoring'
      });

      setIsProcessing(false);
      setCompletedReceipt(receipt);
      if (onDonationComplete) onDonationComplete(receipt);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Contribute Disaster Relief Funds</h3>
              <p className="text-[11px] text-slate-300">
                100% of financial aid directly funds food, water, and survival medicine at relief camps.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {completedReceipt ? (
          /* Official Verified Receipt View */
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs">
            {/* Success Banner */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Donation Confirmed & Received!</h2>
              <p className="text-xs text-slate-600">
                Thank you for your generosity. Your contribution is immediately active in the disaster relief fund.
              </p>
            </div>

            {/* Printable Tax Exemption Voucher */}
            <div className="border-2 border-emerald-600 rounded-xl p-5 bg-white shadow-sm space-y-4 print:border-black">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Official 80G Tax Exemption Certificate
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">AidConnect Humanitarian Aid Fund</h4>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-500">Receipt Number</div>
                  <div className="font-bold text-slate-900">{completedReceipt.receiptNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Amount Contributed:</span>
                  <span className="text-lg font-bold text-emerald-700">₹{completedReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Bank UTR / Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{completedReceipt.utr}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Method:</span>
                  <span className="font-semibold text-slate-800">{completedReceipt.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Donor Name:</span>
                  <span className="font-bold text-slate-900">{completedReceipt.donorName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Beneficiary Relief Camp:</span>
                  <span className="font-semibold text-slate-800">{completedReceipt.targetCampName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Date & Time:</span>
                  <span className="font-mono text-slate-700">{new Date(completedReceipt.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>50% Tax Deduction under Section 80G of Income Tax Act</span>
                </span>
                <span className="font-mono text-[10px]">Status: VERIFIED</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-md text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save 80G Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-md shadow transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Donation Form */
          <form onSubmit={handleSubmitDonation} className="overflow-y-auto p-6 space-y-5 text-xs">
            {/* Step 1: Select Donation Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  1. Select Donation Amount (₹ INR) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-emerald-700 font-bold">50% Tax Deductible (80G)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PRESET_TIERS.map(tier => {
                  const isSelected = !isCustom && amount === tier.amount;
                  return (
                    <button
                      type="button"
                      key={tier.amount}
                      onClick={() => handleSelectTier(tier.amount)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="text-sm font-extrabold">{tier.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom amount input */}
              <div className="pt-2 flex items-center gap-2">
                <span className="text-slate-500 font-medium">Or custom amount:</span>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    placeholder="Enter custom ₹ amount"
                    className={`w-full pl-7 pr-3 py-1.5 border rounded outline-none font-bold text-sm ${
                      isCustom ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20' : 'border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Impact Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 text-emerald-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-600 fill-current shrink-0" />
                <span className="font-semibold">
                  {currentEffectiveAmount >= 10000
                    ? `₹${currentEffectiveAmount.toLocaleString('en-IN')} sponsors over 200 hot meals and emergency survival rations at shelter kitchens.`
                    : currentEffectiveAmount >= 5000
                    ? `₹${currentEffectiveAmount.toLocaleString('en-IN')} sponsors emergency tarpaulins, warm blankets and survival kits.`
                    : currentEffectiveAmount >= 2500
                    ? `₹${currentEffectiveAmount.toLocaleString('en-IN')} sponsors first aid kits and hygiene sanitary packs for 10 families.`
                    : currentEffectiveAmount >= 1000
                    ? `₹${currentEffectiveAmount.toLocaleString('en-IN')} sponsors 100 packaged clean drinking water bottles.`
                    : currentEffectiveAmount >= 500
                    ? `₹${currentEffectiveAmount.toLocaleString('en-IN')} sponsors 25 meals and drinking water packs.`
                    : `Every ₹${currentEffectiveAmount || 0} provides immediate survival aid to affected families.`}
                </span>
              </div>
            </div>

            {/* Step 2: Destination / Target Allocation */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                2. Fund Allocation Destination
              </label>

              {defaultCamp ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    Sponsoring: <strong>{defaultCamp.shelterName || defaultCamp.campName}</strong> (PIN: {defaultCamp.pincode})
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('NEARBY_CAMP')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      targetType === 'NEARBY_CAMP'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct to Nearest Camp (by PIN)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {nearbyInfo?.primaryCamp
                        ? `Auto-links to ${nearbyInfo.primaryCamp.name} (${nearbyInfo.primaryCamp.distance})`
                        : 'Enter your 6-digit PIN below to auto-direct funds to your closest shelter.'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('GENERAL')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      targetType === 'GENERAL'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Central Disaster Relief Emergency Pool</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Deployed flexibly wherever acute shortages or medical emergencies arise.
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Donor Details */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  3. Donor Information
                </label>
                <span className="text-[10px] text-slate-500">Only PIN, Phone & Name required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Postal PIN Code <span className="text-red-500">* Required</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    value={donorDetails.pincode}
                    onChange={(e) => setDonorDetails({ ...donorDetails, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 682001"
                    className="w-full px-3 py-1.5 font-mono font-bold border-2 border-emerald-400 rounded outline-none bg-emerald-50/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Mobile Phone <span className="text-red-500">* Required</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorDetails.phone}
                    onChange={(e) => setDonorDetails({ ...donorDetails, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Full Name <span className="text-red-500">* Required</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={donorDetails.name}
                    onChange={(e) => setDonorDetails({ ...donorDetails, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    Email Address (Optional — for tax certificate)
                  </label>
                  <input
                    type="email"
                    value={donorDetails.email}
                    onChange={(e) => setDonorDetails({ ...donorDetails, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    PAN Card Number (Optional — for 80G tax claim)
                  </label>
                  <input
                    type="text"
                    maxLength="10"
                    value={donorDetails.panNumber}
                    onChange={(e) => setDonorDetails({ ...donorDetails, panNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3 py-1.5 font-mono font-semibold uppercase border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Payment Gateway Mode */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                4. Select Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>UPI / QR</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">GPay, PhonePe, Paytm</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Cards</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Visa, Master, RuPay</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Net Banking</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">SBI, HDFC, ICICI</div>
                </button>
              </div>

              {/* Payment Details Drawer */}
              {paymentMethod === 'UPI' && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">Official UPI ID:</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-800 font-bold">
                      disaster.relief@govtpfc
                    </span>
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter your UPI ID (e.g. mobile@upi, name@okhdfcbank)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-medium bg-white"
                  />
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number (4111 2222 3333 4444)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-mono bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-mono bg-white"
                    />
                    <input
                      type="password"
                      maxLength="3"
                      placeholder="CVV"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-mono bg-white"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <select className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none bg-white font-medium">
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Secure Gateway</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || currentEffectiveAmount <= 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-md transition-colors flex items-center gap-2 text-xs"
              >
                {isProcessing ? (
                  <span>Processing ₹{currentEffectiveAmount.toLocaleString('en-IN')}...</span>
                ) : (
                  <>
                    <span>Pay ₹{currentEffectiveAmount.toLocaleString('en-IN')} & Donate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
