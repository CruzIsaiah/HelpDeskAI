import { useState, useEffect } from "react";
import Link from "next/link";

const DEVICE_DATA: Record<string, Record<string, string[]>> = {
  phone: {
    Apple: [
      "iPhone 12",
      "iPhone 13",
      "iPhone 14",
      "iPhone 15",
      "iPhone SE",
      "iPhone XR",
      "iPhone 16",
      "iPhone 17",
    ],
    Samsung: ["Galaxy S10", "Galaxy S20", "Galaxy S21", "Galaxy A51"],
    Google: ["Pixel 5", "Pixel 6", "Pixel 7"],
    OnePlus: ["OnePlus 8", "OnePlus 9", "OnePlus 10"],
  },

  laptop: {
    Dell: ["Inspiron 15", "XPS 13", "XPS 15"],
    HP: ["Pavilion", "Envy", "Spectre"],
    Lenovo: ["ThinkPad X1", "Yoga 7i", "Legion 5"],
    Apple: ["MacBook Air", "MacBook Pro 13", "MacBook Pro 16"],
  },

  tablet: {
    Apple: ["iPad", "iPad Pro", "iPad Mini"],
    Samsung: ["Galaxy Tab S6", "Galaxy Tab S7"],
    Amazon: ["Fire HD 8", "Fire HD 10"],
  },

  desktop: {
    Dell: ["OptiPlex 7010", "XPS Desktop"],
    HP: ["OMEN 25L", "Pavilion Desktop"],
    Apple: ["iMac 24", "Mac Mini", "Mac Studio"],
  },

  router: {
    Netgear: ["Nighthawk AX5400", "Nighthawk AX6000"],
    TPLink: ["Archer A7", "Archer AX55"],
    Asus: ["RT-AX88U", "RT-AC66U"],
  },

  printer: {
    HP: ["OfficeJet 3830", "DeskJet 2755"],
    Canon: ["PIXMA MG3620", "MAXIFY MB5420"],
    Epson: ["EcoTank ET-2800", "WorkForce WF-2850"],
  },
};

interface Device {
  id: number;
  name: string;
  type: string | null;
  model: string | null;
  os_version: string | null;
  notes: string | null;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");

  const [osVersion, setOsVersion] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/devices");
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error("Error loading devices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e: any) => {
    e.preventDefault();

    const payload = {
      name,
      type,
      model,
      os_version: osVersion,
      notes,
    };

    const res = await fetch("http://localhost:8000/api/devices/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setType("");
      setName("");
      setModel("");
      setOsVersion("");
      setNotes("");
      fetchDevices();
    }
  };

  const deleteDevice = async (id: number) => {
    await fetch(`http://localhost:8000/api/devices/${id}`, {
      method: "DELETE",
    });
    fetchDevices();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <nav className="w-full flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <img src="/favicon.svg" alt="logo" className="h-10 w-10" />

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                HelpDesk Assistant
              </h1>
              <p className="text-sm text-gray-500">Manage your devices</p>
            </div>
          </div>

          <div className="hidden sm:flex gap-4 items-center">
            <Link href="/" className="btn btn-ghost">
              Home
            </Link>
            <Link href="/history" className="btn btn-ghost">
              History
            </Link>
            <Link href="/devices" className="btn btn-ghost">
              Devices
            </Link>
          </div>
        </nav>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Add a Device
            </h2>

            <form className="space-y-6" onSubmit={handleAddDevice}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Device Type
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setName("");
                    setModel("");
                  }}
                >
                  <option value="">Select Type</option>
                  {Object.keys(DEVICE_DATA).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={name}
                  disabled={!type}
                  onChange={(e) => {
                    setName(e.target.value);
                    setModel("");
                  }}
                >
                  <option value="">Select Brand</option>
                  {type &&
                    Object.keys(DEVICE_DATA[type]).map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={model}
                  disabled={!name}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="">Select Model</option>
                  {DEVICE_DATA[type]?.[name]?.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  OS Version
                </label>
                <input
                  className="w-full p-2 border rounded-lg"
                  placeholder="iOS 17, Windows 11..."
                  value={osVersion}
                  onChange={(e) => setOsVersion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Cracked screen, overheating, slow..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Add Device
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Your Devices
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : devices.length === 0 ? (
              <p className="text-gray-600">No devices added yet.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-sm text-gray-600">Brand</th>
                    <th className="py-2 text-sm text-gray-600">Type</th>
                    <th className="py-2 text-sm text-gray-600">Model</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <tr key={d.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{d.name}</td>
                      <td className="py-2 capitalize">{d.type}</td>
                      <td className="py-2">{d.model}</td>

                      <td className="py-2 text-right">
                        <button
                          onClick={() => deleteDevice(d.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
