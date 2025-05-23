"use client";
import { showToast } from "@/app/utils/toast";

export default function GroupMembersTab({ groupDetails }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">
                Members ({groupDetails.memberCount})
            </h2>
            <div className="space-y-3">
                {/* We'll need to implement an API call to fetch members */}
                {/* For now, display a placeholder */}
                <p className="text-center text-gray-500 py-4">
                    Member listing will be implemented in a future update.
                </p>
                <div className="flex justify-center">
                    <button 
                        onClick={() => showToast('Member listing coming soon!', 'info')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                        Refresh Members
                    </button>
                </div>
            </div>
        </div>
    );
}