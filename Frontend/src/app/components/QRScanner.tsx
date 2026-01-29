import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle, Scan, Camera, Upload, AlertCircle } from 'lucide-react';
import QrScanner from 'qr-scanner';
import axios from 'axios';

interface QRScannerProps {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ScanResult {
  success: boolean;
  message: string;
  userName?: string;
  alreadyCheckedIn?: boolean;
  checkedInAt?: Date;
}

const QRScanner: React.FC<QRScannerProps> = ({ eventId, onClose, onSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [useCamera, setUseCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (scanning && useCamera && videoRef.current) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanning, useCamera]);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
    } catch (err: any) {
      setError('Failed to start camera. Please check camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
  };

  const handleScan = async (qrData: string) => {
    if (!qrData) return;

    try {
      setScanning(false);
      stopCamera();

      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:5000/api/attendance/check-in',
        { qrData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setResult({
          success: true,
          message: response.data.message,
          userName: response.data.data.userName,
          alreadyCheckedIn: response.data.data.alreadyCheckedIn,
          checkedInAt: response.data.data.checkedInAt,
        });

        if (!response.data.data.alreadyCheckedIn) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Check-in failed',
      });
      setError(err.response?.data?.message || 'Failed to check in');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      handleScan(result.data);
    } catch (err) {
      setError('Failed to read QR code from image');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl text-slate-900 mb-2">Scan QR Code</h2>
          <p className="text-slate-600">Check in attendees for the event</p>
        </div>

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                result.success
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>
                  {result.message}
                </p>
                {result.userName && (
                  <p className="text-sm mt-1 text-slate-600">Attendee: {result.userName}</p>
                )}
                {result.alreadyCheckedIn && result.checkedInAt && (
                  <p className="text-sm mt-1 text-slate-600">
                    Previously checked in at {new Date(result.checkedInAt).toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && !result && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">{error}</p>
          </div>
        )}

        {/* Scan Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setUseCamera(true);
              setResult(null);
              setError('');
            }}
            className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              useCamera
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-5 h-5" />
            Use Camera
          </button>
          <button
            onClick={() => {
              setUseCamera(false);
              setResult(null);
              setError('');
              stopCamera();
            }}
            className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              !useCamera
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </button>
        </div>

        {/* Scanner/Upload Area */}
        {useCamera ? (
          <div className="relative">
            {scanning ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-80 bg-slate-900 rounded-xl object-cover"
                />
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-xl pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setScanning(true);
                  setResult(null);
                  setError('');
                }}
                className="w-full h-80 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center gap-4"
              >
                <Scan className="w-16 h-16 text-slate-400" />
                <p className="text-slate-600">Click to start scanning</p>
              </button>
            )}
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-80 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center gap-4"
            >
              <Upload className="w-16 h-16 text-slate-400" />
              <p className="text-slate-600">Click to upload QR code image</p>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {scanning && (
            <button
              onClick={() => {
                setScanning(false);
                stopCamera();
              }}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Stop Scanning
            </button>
          )}
          {result && (
            <button
              onClick={() => {
                setResult(null);
                setError('');
                if (useCamera) {
                  setScanning(true);
                }
              }}
              className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              Scan Next
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRScanner;
