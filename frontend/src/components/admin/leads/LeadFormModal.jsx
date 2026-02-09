import { useEffect, useState } from "react";
import { createLead, updateLead } from "../../../api/admin/lead.api.js";


const emptyLead = {
  name: "",
  email: "",
  phone: "",
  preferred_location: "",
  source: "",
  no_guest: "",
  event_date: "",
  slot: [],
  menu: [],
  event_type: "",
  budget: "",
};

// Field with label on top (avoids overlap)
const Field = ({ label, children, error }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default function LeadFormModal({ open, editingLead, onClose, onSaved, }) {
  const isEdit = !!editingLead;
  const [lead, setLead] = useState(emptyLead);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingLead) {
      setLead({
        ...emptyLead,
        ...editingLead,
        event_date: editingLead.event_date
          ? new Date(editingLead.event_date).toISOString().split("T")[0]
          : "",
        slot: editingLead.slot || [],
        menu: editingLead.menu || [],
      });
    } else {
      setLead(emptyLead);
    }
    setErrors({});
  }, [editingLead]);

  const validate = () => {
    const newErrors = {};
    if (!lead.name) newErrors.name = "Name is required";
    if (!lead.email) newErrors.email = "Email is required";
    if (!lead.phone) newErrors.phone = "Phone is required";
    if (!lead.preferred_location) newErrors.preferred_location = "Location is required";
    if (!lead.source) newErrors.source = "Source is required";
    if (!lead.no_guest) newErrors.no_guest = "Number of guests is required";
    if (!lead.event_date) newErrors.event_date = "Event date is required";
    if (!lead.event_type) newErrors.event_type = "Event type is required";
    if (!lead.budget) newErrors.budget = "Budget is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        ...lead,
        slot: lead.slot.length ? lead.slot.join(",") : null,
        menu: lead.menu.length ? lead.menu.join(",") : null,
        event_date: lead.event_date || null,
        no_guest: lead.no_guest,
      };

      if (isEdit) {
        await updateLead(editingLead.id, payload);
        alert("Lead updated");
      } else {
        await createLead(payload);
        alert("Lead created");
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text";

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 hide-scrollbar overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[900px] shadow-xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Lead" : "Create Lead"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 text-xl hover:text-black cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Form */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">Saving…</div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <Field label="Name" error={errors.name}>
              <input
                className={inputClass}
                value={lead.name}
                onChange={e => setLead({ ...lead, name: e.target.value })}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                className={inputClass}
                value={lead.email}
                onChange={e => setLead({ ...lead, email: e.target.value })}
              />
            </Field>

            <Field label="Phone" error={errors.phone}>
              <input
                className={inputClass}
                value={lead.phone}
                onChange={e => setLead({ ...lead, phone: e.target.value })}
              />
            </Field>

            <Field label="Preferred Location" error={errors.preferred_location}>
              <input
                className={inputClass}
                value={lead.preferred_location}
                onChange={e => setLead({ ...lead, preferred_location: e.target.value })}
              />
            </Field>

            <Field label="Source" error={errors.source}>
              <select
                className={inputClass + " cursor-pointer"}
                value={lead.source}
                onChange={e => setLead({ ...lead, source: e.target.value })}
              >
                <option value="">-- Select Source --</option>
                <option value="Google">Google</option>
                <option value="Facebook">Facebook</option>
                <option value="Meta">Meta</option>
                <option value="Calling">Calling</option>
                <option value="Our Website">Our Website</option>
                <option value="Other Source">Other Source</option>

              </select>
            </Field>

            <Field label="No. of Guests" error={errors.no_guest}>
              <input
                type="number"
                className={inputClass}
                value={lead.no_guest}
                onChange={e => setLead({ ...lead, no_guest: e.target.value })}
              />
            </Field>

            <Field label="Event Date" error={errors.event_date}>
              <input
                type="date"
                className={inputClass + " cursor-pointer"}
                value={lead.event_date}
                onChange={e => setLead({ ...lead, event_date: e.target.value })}
              />
            </Field>

            <Field label="Event Type" error={errors.event_type}>
              <input
                className={inputClass}
                value={lead.event_type}
                onChange={e => setLead({ ...lead, event_type: e.target.value })}
              />
            </Field>

            <Field label="Budget" error={errors.budget}>
              <input
                className={inputClass}
                value={lead.budget}
                onChange={e => setLead({ ...lead, budget: e.target.value })}
              />
            </Field>

            <Field label="Slot">
              <div className="flex gap-4 mt-1">
                {["Lunch", "Dinner"].map(v => (
                  <label
                    key={v}
                    className="flex items-center gap-2 text-sm cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={lead.slot.includes(v)}
                      onChange={() =>
                        setLead({
                          ...lead,
                          slot: lead.slot.includes(v)
                            ? lead.slot.filter(s => s !== v)
                            : [...lead.slot, v],
                        })
                      }
                      className="cursor-pointer"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Menu">
              <div className="flex gap-4 mt-1">
                {["Veg", "Non Veg"].map(v => (
                  <label
                    key={v}
                    className="flex items-center gap-2 text-sm cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={lead.menu.includes(v)}
                      onChange={() =>
                        setLead({
                          ...lead,
                          menu: lead.menu.includes(v)
                            ? lead.menu.filter(m => m !== v)
                            : [...lead.menu, v],
                        })
                      }
                      className="cursor-pointer"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer font-medium"
          >
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}
