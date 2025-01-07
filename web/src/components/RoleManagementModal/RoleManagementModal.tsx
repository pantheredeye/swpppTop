import { useState } from 'react';

const RoleManagementModal = ({ member, onClose }) => {
  const [selectedRoles, setSelectedRoles] = useState(member.roles);

  const handleSave = () => {
    console.log('Saving roles:', selectedRoles);
    onClose();
  };

  // TODO Fetch these dynamically

  const availableRoles = [
    { id: '1', name: 'OWNER' },
    { id: '2', name: 'MEMBER' },
    { id: '3', name: 'ADMIN' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Edit Roles for {member.user.email}</h2>
        <div className="space-y-2">
          {availableRoles.map((role) => (
            <label key={role.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRoles.some((r) => r.id === role.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRoles([...selectedRoles, role]);
                  } else {
                    setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
                  }
                }}
              />
              <span className="text-gray-200">{role.name}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-600 text-gray-200 px-4 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-gray-200 px-4 py-2 rounded hover:bg-blue-500"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementModal;
