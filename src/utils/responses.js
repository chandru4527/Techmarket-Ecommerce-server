// user response
export const userRes = (user) => ({
    id: user?._id,
    name: user?.name,
    userName: user?.userName,
    email: user?.email,
    role: user?.role,
    permissions: user?.permissions || [],
    profileImage: user?.profileImage?.url || "",
    isActive: user?.isActive,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
    mobile: user?.mobile,
    address: user?.address,
    lastLogin: user?.lastLogin || null,
    uid: user?.uid || null,
    dateOfBirth: user?.dateOfBirth || null,
});