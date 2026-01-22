import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

/**
 * BarcodeScanner Component
 * ------------------------
 * Props:
 *  - onDetected(code: string): called when a stable barcode is detected
 */
export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const stableCount = useRef(0);
  const lastCode = useRef(null);

  useEffect(() => {
    const startScanner = async () => {
      // Stop existing scanner if any
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          alert("Camera not found");
          return;
        }

        await scanner.start(
          cameras[cameras.length - 1].id, // back camera
          {
            fps: 10,
            qrbox: { width: 260, height: 160 },
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.UPC_A
            ]
          },
          async (code) => {
            // Accept only numeric barcodes (EAN / UPC)
            if (!/^\d{8,13}$/.test(code)) return;

            if (code === lastCode.current) {
              stableCount.current++;
            } else {
              lastCode.current = code;
              stableCount.current = 1;
            }

            // Require 2 stable reads (same as before)
            if (stableCount.current < 2) return;

            try {
              await scanner.stop();
              scanner.clear();
            } catch {}

            onDetected(code);
          }
        );
      } catch (err) {
        console.error("Scanner error:", err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .then(() => {
            scannerRef.current?.clear();
          });
      }
    };
  }, [onDetected]);

  return (
    <div
      id="barcode-reader"
      className="relative h-72 rounded-xl overflow-hidden bg-black border border-slate-700 shadow-inner"
    />
  );
}