"use client";

export default function GroupAboutTab({ groupDetails }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Tên nhóm
                    </h3>
                    <p className="mt-1">{groupDetails.groupName}</p>
                </div>
                
                
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Chế độ
                    </h3>
                    <p className="mt-1 flex items-center">
                        <span
                            className={`mr-2 w-2 h-2 rounded-full ${
                                groupDetails.visibility.toLowerCase() === "public"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                            }`}
                        ></span>
                        {/* {groupDetails.visibility.charAt(0).toUpperCase() +
                            groupDetails.visibility.slice(1).toLowerCase()} */}
                        Công khai
                    </p>
                </div>
                
                
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Ngày tạo
                    </h3>
                    <p className="mt-1">
                        {new Date(groupDetails.createdAt).toLocaleString()}
                    </p>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Thành viên
                    </h3>
                    <p className="mt-1">
                        {groupDetails.memberCount.toLocaleString()} thành viên
                    </p>
                </div>
            </div>
        </div>
    );
}