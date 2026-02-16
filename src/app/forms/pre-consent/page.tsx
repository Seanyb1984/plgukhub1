'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Webcam from 'react-webcam';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  XCircle,
  Pen,
  Trash2,
  Shield,
  Loader2,
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface MedicalQuestion {
  id: string;
  question: string;
  riskType: 'hard_stop' | 'soft_warning' | 'info';
  riskMessage: string;
}

interface RiskFlag {
  questionId: string;
  type: 'hard_stop' | 'soft_warning';
  message: string;
}

// ============================================
// Medical History Questions (CQC-aligned)
// ============================================

const MEDICAL_QUESTIONS: MedicalQuestion[] = [
  { id: 'blood_disorder', question: 'Do you have a blood clotting disorder or are you taking blood-thinning medication (e.g., Warfarin, Heparin)?', riskType: 'hard_stop', riskMessage: 'HARD STOP: Blood disorder / anticoagulant detected. Treatment cannot proceed without Prescriber clearance.' },
  { id: 'pregnant', question: 'Are you currently pregnant or breastfeeding?', riskType: 'hard_stop', riskMessage: 'HARD STOP: Pregnancy/breastfeeding detected. POM treatments are contraindicated.' },
  { id: 'active_infection', question: 'Do you have any active skin infections, cold sores, or open wounds in the treatment area?', riskType: 'hard_stop', riskMessage: 'HARD STOP: Active infection in treatment area. Must be resolved before treatment.' },
  { id: 'allergies', question: 'Do you have any known allergies to medications, anaesthetics, or injectable products?', riskType: 'soft_warning', riskMessage: 'WARNING: Allergies declared. Practitioner must review allergen details before proceeding.' },
  { id: 'autoimmune', question: 'Do you have any autoimmune conditions (e.g., Lupus, Rheumatoid Arthritis, Multiple Sclerosis)?', riskType: 'soft_warning', riskMessage: 'WARNING: Autoimmune condition declared. Prescriber review recommended.' },
  { id: 'previous_reaction', question: 'Have you ever had an adverse reaction to dermal fillers, Botox, or similar treatments?', riskType: 'soft_warning', riskMessage: 'WARNING: Previous adverse reaction. Full incident history must be reviewed.' },
  { id: 'medications', question: 'Are you currently taking any prescription medications?', riskType: 'info', riskMessage: 'Note: Current medications declared. Record details in clinical notes.' },
  { id: 'recent_procedures', question: 'Have you had any cosmetic procedures in the last 14 days?', riskType: 'soft_warning', riskMessage: 'WARNING: Recent procedure within 14 days. Allow adequate recovery time.' },
  { id: 'keloid', question: 'Do you have a history of keloid or hypertrophic scarring?', riskType: 'soft_warning', riskMessage: 'WARNING: Keloid scarring history. Higher risk of adverse scarring.' },
  { id: 'heart_condition', question: 'Do you have any heart conditions or have you had a stroke?', riskType: 'hard_stop', riskMessage: 'HARD STOP: Cardiac/stroke history. Treatment cannot proceed without cardiologist clearance.' },
];

// ============================================
// Component
// ============================================

export default function PreConsentPage() {
  // Form state
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('MENHANCEMENTS');
  const [treatmentType, setTreatmentType] = useState('');

  // Medical screening
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [allergyDetails, setAllergyDetails] = useState('');
  const [medicationDetails, setMedicationDetails] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Dynamic risks
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([]);
  const hasHardStop = riskFlags.some((r) => r.type === 'hard_stop');

  // Signature
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signedByName, setSignedByName] = useState('');

  // Webcam
  const webcamRef = useRef<Webcam | null>(null);
  const [webcamCapture, setWebcamCapture] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  // Before photos
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ---- Dynamic Risk Calculation ----
  useEffect(() => {
    const flags: RiskFlag[] = [];
    MEDICAL_QUESTIONS.forEach((q) => {
      if (answers[q.id] === true && q.riskType !== 'info') {
        flags.push({
          questionId: q.id,
          type: q.riskType,
          message: q.riskMessage,
        });
      }
    });
    setRiskFlags(flags);
  }, [answers]);

  // ---- Handlers ----
  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const clearSignature = () => {
    sigRef.current?.clear();
    setSignatureData(null);
  };

  const saveSignature = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      setSignatureData(sigRef.current.toDataURL('image/png'));
    }
  };

  const captureWebcam = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setWebcamCapture(screenshot);
      setShowWebcam(false);
    }
  }, []);

  const captureBeforePhoto = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setBeforePhotos((prev) => [...prev, screenshot]);
    }
  }, []);

  const removeBeforePhoto = (index: number) => {
    setBeforePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ---- Submit Pre-Consent ----
  const handleSubmit = async () => {
    if (hasHardStop) return;
    if (!signatureData) {
      setSubmitError('Client signature is required.');
      return;
    }
    if (!signedByName.trim()) {
      setSubmitError('Please enter the name of the person signing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        clientId: selectedClientId,
        brand: selectedBrand,
        treatmentType,
        medicalHistory: answers,
        allergyDetails,
        medicationDetails,
        additionalNotes,
        riskFlags,
        signatureData,
        signedByName,
        webcamCapture,
        beforePhotos,
      };

      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create episode');
      }

      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Render ----
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Pre-Consent Complete</h2>
          <p className="text-sm text-slate-500 mb-6">
            Episode created successfully. The client has been consented and is ready for treatment.
          </p>
          <a
            href="/admin"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Command Centre
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Pre-Consent Form</h1>
          <p className="text-sm text-slate-500 mt-1">
            Medical History &middot; CQC Safety Screening &middot; Client Signature &middot; ID Verification
          </p>
        </div>

        {/* Section 1: Client & Treatment Selection */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
            Client &amp; Treatment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client Search</label>
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {selectedClientId && (
                <p className="text-xs text-green-600 mt-1">Client selected: {selectedClientId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MENHANCEMENTS">Menhancements</option>
                <option value="WAX_FOR_MEN">Wax for Men</option>
                <option value="WAX_FOR_WOMEN">Wax for Women</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Type</label>
              <input
                type="text"
                value={treatmentType}
                onChange={(e) => setTreatmentType(e.target.value)}
                placeholder="e.g., Botox, Dermal Filler, Brazilian Wax..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Medical History & Safety Screening */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
            Medical History &amp; Safety Screening
          </h2>

          <div className="space-y-4">
            {MEDICAL_QUESTIONS.map((q) => (
              <div
                key={q.id}
                className={`p-4 rounded-lg border ${
                  answers[q.id] === true && q.riskType === 'hard_stop'
                    ? 'border-red-300 bg-red-50'
                    : answers[q.id] === true && q.riskType === 'soft_warning'
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-slate-700 flex-1">{q.question}</p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAnswer(q.id, true)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                        answers[q.id] === true
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswer(q.id, false)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                        answers[q.id] === false
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                {answers[q.id] === true && q.riskType !== 'info' && (
                  <div className={`mt-2 text-xs font-medium ${q.riskType === 'hard_stop' ? 'text-red-700' : 'text-amber-700'}`}>
                    {q.riskType === 'hard_stop' ? <XCircle className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                    {q.riskMessage}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Allergy Details */}
          {answers['allergies'] === true && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Allergy Details *</label>
              <textarea
                value={allergyDetails}
                onChange={(e) => setAllergyDetails(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="List all known allergies..."
              />
            </div>
          )}

          {/* Medication Details */}
          {answers['medications'] === true && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications</label>
              <textarea
                value={medicationDetails}
                onChange={(e) => setMedicationDetails(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="List all current medications..."
              />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Any other medical or clinical notes..."
            />
          </div>
        </section>

        {/* Dynamic Risk Panel */}
        {riskFlags.length > 0 && (
          <section className={`rounded-xl p-6 mb-6 border ${hasHardStop ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
            <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${hasHardStop ? 'text-red-800' : 'text-amber-800'}`}>
              <Shield className="w-5 h-5" />
              {hasHardStop ? 'TREATMENT BLOCKED' : 'Risk Warnings'}
            </h2>
            <ul className="space-y-2">
              {riskFlags.map((flag) => (
                <li key={flag.questionId} className={`text-sm ${flag.type === 'hard_stop' ? 'text-red-700 font-medium' : 'text-amber-700'}`}>
                  {flag.type === 'hard_stop' ? <XCircle className="w-4 h-4 inline mr-1" /> : <AlertTriangle className="w-4 h-4 inline mr-1" />}
                  {flag.message}
                </li>
              ))}
            </ul>
            {hasHardStop && (
              <p className="mt-3 text-sm font-bold text-red-800">
                This form cannot be submitted. A Prescriber (Dr. Phil) must clear these contraindications before treatment can proceed.
              </p>
            )}
          </section>
        )}

        {/* Section 3: Webcam ID Verification */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
            ID Verification &amp; Before Photos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Webcam ID */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Live ID Capture</h3>
              {webcamCapture ? (
                <div className="relative">
                  <img src={webcamCapture} alt="ID Verification" className="rounded-lg border border-slate-200 w-full" />
                  <button
                    type="button"
                    onClick={() => { setWebcamCapture(null); setShowWebcam(true); }}
                    className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm border border-slate-200"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ) : showWebcam ? (
                <div>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="rounded-lg border border-slate-200 w-full"
                    videoConstraints={{ facingMode: 'user', width: 480, height: 360 }}
                  />
                  <button
                    type="button"
                    onClick={captureWebcam}
                    className="mt-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" /> Capture ID Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowWebcam(true)}
                  className="w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex flex-col items-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  Open Camera for ID Verification
                </button>
              )}
            </div>

            {/* Before Photos */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Before Photos</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {beforePhotos.map((photo, i) => (
                  <div key={i} className="relative">
                    <img src={photo} alt={`Before ${i + 1}`} className="rounded-lg border border-slate-200 w-full aspect-square object-cover" />
                    <button
                      type="button"
                      onClick={() => removeBeforePhoto(i)}
                      className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-sm border border-slate-200"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              {showWebcam && (
                <button
                  type="button"
                  onClick={captureBeforePhoto}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Capture Before Photo
                </button>
              )}
              {!showWebcam && beforePhotos.length === 0 && (
                <p className="text-xs text-slate-400">Open the camera above to capture before photos.</p>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Consent Declaration & Signature */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">4</span>
            Consent Declaration &amp; Signature
          </h2>

          <div className="bg-slate-50 rounded-lg p-4 mb-4 text-sm text-slate-700 leading-relaxed">
            <p className="font-medium mb-2">I confirm that:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>I have read and understood the information provided about the proposed treatment.</li>
              <li>I have had the opportunity to ask questions and have received satisfactory answers.</li>
              <li>I understand the potential risks, complications, and side effects.</li>
              <li>I consent to the treatment being carried out by the named practitioner.</li>
              <li>I understand I have the right to withdraw consent at any time before the procedure.</li>
              <li>The medical information I have provided is true and complete to the best of my knowledge.</li>
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name (Print)</label>
            <input
              type="text"
              value={signedByName}
              onChange={(e) => setSignedByName(e.target.value)}
              placeholder="Client's full name..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Pen className="w-3 h-3" /> Signature
            </label>
            {signatureData ? (
              <div className="relative">
                <img src={signatureData} alt="Signature" className="border border-slate-300 rounded-lg bg-white w-full h-40 object-contain" />
                <button
                  type="button"
                  onClick={clearSignature}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm border border-slate-200 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ) : (
              <div>
                <div className="border border-slate-300 rounded-lg bg-white">
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="black"
                    canvasProps={{ className: 'w-full h-40' }}
                    onEnd={saveSignature}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={saveSignature}
                    className="px-3 py-1.5 text-xs text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    Confirm Signature
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col items-center gap-3">
          {submitError && (
            <p className="text-sm text-red-600 font-medium">{submitError}</p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={hasHardStop || isSubmitting}
            className={`w-full max-w-md px-6 py-3 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              hasHardStop
                ? 'bg-red-400 cursor-not-allowed'
                : isSubmitting
                ? 'bg-blue-400 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating Episode...</>
            ) : hasHardStop ? (
              <><XCircle className="w-4 h-4" /> Blocked by Safety Screening</>
            ) : (
              <><ChevronRight className="w-4 h-4" /> Submit Pre-Consent &amp; Create Episode</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
