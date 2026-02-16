'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  Package,
  Trash2,
  Mail,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export default function PostTreatmentPage() {
  // Episode reference
  const [episodeRef, setEpisodeRef] = useState('');
  const [episodeLoaded, setEpisodeLoaded] = useState(false);
  const [episodeData, setEpisodeData] = useState<{
    clientName: string;
    treatmentType: string;
    brand: string;
  } | null>(null);

  // Batch logging
  const [productUsed, setProductUsed] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [dosage, setDosage] = useState('');
  const [treatmentAreas, setTreatmentAreas] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [complications, setComplications] = useState('');

  // After photos
  const webcamRef = useRef<Webcam | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);

  // Aftercare
  const [aftercareProvided, setAftercareProvided] = useState(false);
  const [sendAftercareEmail, setSendAftercareEmail] = useState(true);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ---- Load Episode ----
  const loadEpisode = async () => {
    if (!episodeRef.trim()) return;
    try {
      const res = await fetch(`/api/episodes?ref=${encodeURIComponent(episodeRef)}`);
      if (!res.ok) throw new Error('Episode not found');
      const data = await res.json();
      setEpisodeData({
        clientName: data.clientName,
        treatmentType: data.treatmentType || '',
        brand: data.brand,
      });
      setProductUsed(data.productUsed || '');
      setEpisodeLoaded(true);
    } catch {
      setSubmitError('Episode not found. Check the reference and try again.');
    }
  };

  // ---- Capture After Photo ----
  const captureAfterPhoto = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setAfterPhotos((prev) => [...prev, screenshot]);
    }
  }, []);

  const removeAfterPhoto = (index: number) => {
    setAfterPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ---- Submit Post-Treatment ----
  const handleSubmit = async () => {
    if (!batchNumber.trim()) {
      setSubmitError('Batch number is required for traceability.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/episodes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeRef,
          action: 'complete_treatment',
          productUsed,
          batchNumber,
          lotNumber,
          expiryDate: expiryDate || null,
          dosage,
          treatmentAreas: treatmentAreas.split(',').map((a) => a.trim()).filter(Boolean),
          clinicalNotes,
          complications,
          afterPhotos,
          aftercareProvided,
          sendAftercareEmail,
          followUpDate: followUpDate || null,
          followUpNotes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to complete treatment');
      }

      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Success State ----
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Treatment Complete</h2>
          <p className="text-sm text-slate-500 mb-2">
            Episode <span className="font-mono font-medium">{episodeRef}</span> has been closed.
          </p>
          {sendAftercareEmail && (
            <p className="text-sm text-blue-600 mb-6 flex items-center justify-center gap-1">
              <Mail className="w-4 h-4" /> Aftercare email queued for delivery.
            </p>
          )}
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
          <h1 className="text-2xl font-bold text-slate-900">Post-Treatment Record</h1>
          <p className="text-sm text-slate-500 mt-1">
            Batch Logging &middot; After Photos &middot; Aftercare Trigger
          </p>
        </div>

        {/* Section 1: Episode Lookup */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
            Load Episode
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={episodeRef}
              onChange={(e) => setEpisodeRef(e.target.value)}
              placeholder="Enter episode reference..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={loadEpisode}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Load
            </button>
          </div>
          {episodeData && (
            <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm">
              <p><span className="font-medium">Client:</span> {episodeData.clientName}</p>
              <p><span className="font-medium">Treatment:</span> {episodeData.treatmentType}</p>
              <p><span className="font-medium">Brand:</span> {episodeData.brand.replace(/_/g, ' ')}</p>
            </div>
          )}
        </section>

        {/* Section 2: Batch & Product Logging */}
        <section className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6 ${!episodeLoaded ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
            <Package className="w-4 h-4" /> Batch &amp; Product Logging
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Used *</label>
              <input
                type="text"
                value={productUsed}
                onChange={(e) => setProductUsed(e.target.value)}
                placeholder="e.g., Botox 100U, Juvederm Ultra 3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number *</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Manufacturer batch number"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lot Number</label>
              <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 20 units, 1ml"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Areas</label>
              <input
                type="text"
                value={treatmentAreas}
                onChange={(e) => setTreatmentAreas(e.target.value)}
                placeholder="Forehead, Crow's Feet, Glabella"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes</label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Treatment observations, technique notes..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" /> Complications
              </label>
              <textarea
                value={complications}
                onChange={(e) => setComplications(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Any adverse reactions, complications, or concerns..."
              />
            </div>
          </div>
        </section>

        {/* Section 3: After Photos */}
        <section className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6 ${!episodeLoaded ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
            <Camera className="w-4 h-4" /> After Photos
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {afterPhotos.map((photo, i) => (
              <div key={i} className="relative">
                <img src={photo} alt={`After ${i + 1}`} className="rounded-lg border border-slate-200 w-full aspect-square object-cover" />
                <button
                  type="button"
                  onClick={() => removeAfterPhoto(i)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-sm border border-slate-200"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
          {showWebcam ? (
            <div>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-lg border border-slate-200 w-full max-w-md"
                videoConstraints={{ facingMode: 'environment', width: 480, height: 360 }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={captureAfterPhoto}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Capture
                </button>
                <button
                  type="button"
                  onClick={() => setShowWebcam(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-300 text-sm rounded-lg hover:bg-slate-50"
                >
                  Close Camera
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowWebcam(true)}
              className="px-4 py-6 w-full border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-purple-400 hover:text-purple-600 transition-colors flex flex-col items-center gap-2"
            >
              <Camera className="w-6 h-6" />
              Open Camera for After Photos
            </button>
          )}
        </section>

        {/* Section 4: Aftercare & Follow-up */}
        <section className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6 ${!episodeLoaded ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">4</span>
            <Mail className="w-4 h-4" /> Aftercare &amp; Follow-up
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aftercareProvided}
                onChange={(e) => setAftercareProvided(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-slate-700">Aftercare advice provided verbally and/or in writing</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendAftercareEmail}
                onChange={(e) => setSendAftercareEmail(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-slate-700">Send aftercare email to client via Gmail API</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Notes</label>
                <input
                  type="text"
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Review in 2 weeks..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
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
            disabled={!episodeLoaded || isSubmitting}
            className={`w-full max-w-md px-6 py-3 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              !episodeLoaded
                ? 'bg-slate-400 cursor-not-allowed'
                : isSubmitting
                ? 'bg-purple-400 cursor-wait'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Completing Episode...</>
            ) : (
              <><ChevronRight className="w-4 h-4" /> Complete Treatment &amp; Close Episode</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
