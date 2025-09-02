import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeLayout from '../../components/EmployeeLayout';
import { uploadAttendanceSelfie, getAttendanceStatus } from '../../api/employee';

export default function EmployeeAttendance() {
  const [preview, setPreview] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [alreadyDone, setAlreadyDone] = useState(false);

  React.useEffect(() => {
    let stream;
    (async () => {
      // Check if already marked; if yes, show notice but don't redirect automatically
      try {
        const status = await getAttendanceStatus();
        if (status?.success && status.doneToday) {
          setAlreadyDone(true);
        }
      } catch {}
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error('Camera access error', e);
        setCameraOn(false);
      }
    })();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreview(dataUrl);
  };

  const retake = () => setPreview(null);

  const submit = async () => {
    if (!preview) return;
    setSubmitting(true);
    try {
      const res = await uploadAttendanceSelfie(preview);
      if (res?.success) {
        try {
          const employeeUser = JSON.parse(localStorage.getItem('employeeUser') || '{}');
          const employeeId = employeeUser?.id || 'unknown';
          const todayKey = new Date().toISOString().slice(0,10);
          sessionStorage.setItem(`employeeAttendance:${employeeId}:${todayKey}`, 'done');
        } catch {}
        navigate('/employee/dashboard', { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="p-4 md:p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
        {alreadyDone && (
          <div className="bg-green-50 text-green-800 border border-green-200 rounded p-3 mb-4 text-sm flex items-center justify-between">
            <span>Today's attendance is already marked.</span>
            <button onClick={() => navigate('/employee/dashboard', { replace: true })} className="bg-green-600 text-white px-3 py-1 rounded">
              Continue
            </button>
          </div>
        )}
        {!preview && (
          <div className="space-y-4">
            {cameraOn ? (
              <div className="rounded overflow-hidden border">
                <video ref={videoRef} autoPlay playsInline className="w-full" />
              </div>
            ) : (
              <div className="text-red-600">Camera not available. Please allow camera access.</div>
            )}
            <button onClick={capture} className="bg-blue-600 text-white py-2 px-4 rounded" disabled={!cameraOn}>
              Take Selfie
            </button>
          </div>
        )}
        {preview && (
          <div className="space-y-4">
            <img src={preview} alt="attendance" className="rounded border" />
            <div className="flex gap-2">
              <button onClick={retake} className="border px-4 py-2 rounded">Retake</button>
              <button onClick={submit} className="bg-green-600 text-white py-2 px-4 rounded" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit & Continue'}
              </button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </EmployeeLayout>
  );
}
