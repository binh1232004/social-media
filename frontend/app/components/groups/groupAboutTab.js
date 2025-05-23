"use client";

export default function GroupAboutTab({ groupDetails }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">
                About this Group
            </h2>
            
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Group Name
                    </h3>
                    <p className="mt-1">{groupDetails.groupName}</p>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Description
                    </h3>
                    <p className="mt-1">{groupDetails.description}</p>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Privacy
                    </h3>
                    <p className="mt-1 flex items-center">
                        <span
                            className={`mr-2 w-2 h-2 rounded-full ${
                                groupDetails.visibility.toLowerCase() === "public"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                            }`}
                        ></span>
                        {groupDetails.visibility.charAt(0).toUpperCase() +
                            groupDetails.visibility.slice(1).toLowerCase()}
                    </p>
                </div>
                
                
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Created At
                    </h3>
                    <p className="mt-1">
                        {new Date(groupDetails.createdAt).toLocaleString()}
                    </p>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Member Count
                    </h3>
                    <p className="mt-1">
                        {groupDetails.memberCount.toLocaleString()} members
                    </p>
                </div>
            </div>
        </div>
    );
}