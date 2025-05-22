/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

import {
  Loader,
  Trash,
  Eye,
  UserPlus2,
  Search,
  MoreHorizontal,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteUser, getAllUsers, updateRoleUser } from "@/api/auth.api";
import RoleUpdate from "./RoleUpdate";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createDoctor, deleteDoctor } from "@/api/doctor.api";
import DeleteModal from "@/components/DeleteModal";
import UserStatistics from "./UserStatistics";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [showRoleMenu, setShowRoleMenu] = useState(null);
  const navigate = useNavigate();

  const roles = [
    { id: 1, label: "ADMIN" },
    { id: 2, label: "DOCTOR" },
    { id: 3, label: "PATIENT" },
  ];
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.DT);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      String(user?.id).includes(searchTerm)  ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter
      ? Number(user.role_id) === Number(roleFilter)
      : true;

    return matchesSearch && matchesRole;
  });

  const endIndex = currentPage * usersPerPage;
  const startIndex = endIndex - usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleRoleClick = (user) => {
    setShowRoleMenu(user.id);
  };
  const handleRoleUpdate = async (user, newRole) => {
    try {

      const updatedUsers = await updateRoleUser(user.id, newRole);
      if (updatedUsers.EC === 0) {
        toast.success(updatedUsers.EM);
        fetchUsers();

        if (user.role_id === 2 && newRole.id !== 2) {
          deleteDoctor(user.id);
        } else if (newRole.id === 2) {
          createDoctor(user);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details ||
        error.response?.data?.error?.message;
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
    }
  };

    const handleDelete = () =>{
      return  deleteUser(userToDelete?.id)
    }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mt-20">
      <UserStatistics users={users } />
      <Card className="mt-5">
        <CardHeader>
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600 dark:text-gray-300 my-2">
              Quản lý và theo dõi người dùng
            </p>
          </div>
          {/* Actions Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-6 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Tất cả</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <Button
                variant="info"
                onClick={() => navigate("/admin/users/create")}
              >
                <UserPlus2 className="w-5 h-5" />
                Thêm người dùng
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Họ tên</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Giới tính</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.user_id} className="border-b">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.full_name || "N/A"}</td>
                    <td className="px-4 py-2">{user.email}</td>

                    <td className="px-4 py-2">{user.gender}</td>

                    <td className="px-4 py-2">
                      <div
                        onClick={() => handleRoleClick(user)}
                        className="cursor-pointer"
                      >
                        <Badge
                          variant={
                            user.role.role === "ADMIN"
                              ? "admin"
                              : user.role.role === "DOCTOR"
                              ? "doctor"
                              : user.role.role === "PATIENT"
                              ? "patient"
                              : "light"
                          }
                        >
                          {user.role.role || "N/A"}
                        </Badge>
                      </div>
                      <RoleUpdate
                        user={user}
                        showRoleMenu={showRoleMenu === user.id}
                        roles={roles}
                        onRoleClick={setShowRoleMenu}
                        onRoleUpdate={handleRoleUpdate}
                        onClose={() => setShowRoleMenu(null)}
                      />
                    </td>

                    <td className="px-4 py-2 flex justify-center space-x-2">
                      <div className="w-[10%] flex items-center justify-end pr-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            sideOffset={4}
                            className="w-32 rounded-md p-2 shadow-md ring-1 ring-gray-200 transition-all"
                          >
                            <div className="flex flex-col space-y-1">
                              <Button
                                variant="ghost"
                                className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950  rounded px-2 py-1 text-sm"
                                onClick={() =>
                                  navigate(`/admin/users/${user.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="font-normal">Xem</span>
                              </Button>
                              <Button
                                variant="ghost"
                                className="flex items-center justify-start hover:bg-gray-100  dark:hover:bg-blue-950  rounded px-2 py-1 text-sm text-red-500"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                <span className="font-normal">Xóa </span>
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={startIndex + 1}
              showingTo={Math.min(endIndex, filteredUsers.length)}
              totalItems={filteredUsers.length}
              itemName="users"
            />
          )}
        </CardContent>
      </Card>

{userToDelete && 
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={userToDelete}
          handleDelete={handleDelete}
          fetch={fetchUsers}
        
        />
}
    </div>
  );
};

export default UserList;
