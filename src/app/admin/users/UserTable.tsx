"use client";

import { useState, useTransition } from "react";
import { updateUserRole, deleteUser } from "../actions";
import { MoreVertical, Trash2, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";

type UserWithStats = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  _count: {
    orders: number;
  }
};

export default function UserTable({ users }: { users: UserWithStats[] }) {
  const [isPending, startTransition] = useTransition();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(`Apakah Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole}?`)) {
      startTransition(async () => {
        try {
          await updateUserRole(userId, newRole);
          setOpenDropdown(null);
        } catch (error) {
          alert("Gagal mengubah peran pengguna.");
        }
      });
    }
  };

  const handleDelete = (userId: string, orderCount: number) => {
    let msg = "Apakah Anda yakin ingin menghapus pengguna ini secara permanen?";
    if (orderCount > 0) {
      msg = `PERINGATAN: Pengguna ini memiliki ${orderCount} pesanan. Menghapus pengguna ini juga akan MENGHAPUS SELURUH RIWAYAT PESANANNYA secara permanen. Lanjutkan?`;
    }

    if (confirm(msg)) {
      startTransition(async () => {
        try {
          await deleteUser(userId);
          setOpenDropdown(null);
        } catch (error) {
          alert("Gagal menghapus pengguna.");
        }
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Nama Pelanggan</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status / Role</th>
              <th className="px-6 py-4">Tgl Bergabung</th>
              <th className="px-6 py-4 text-center">Total Pesanan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                <td className="px-6 py-4 font-medium text-black">
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 hover:text-gray-600 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs group-hover:bg-gray-800 transition-colors">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="border-b border-transparent group-hover:border-gray-400">{user.name.split(' | PHONE:')[0]}</span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${
                    user.role === 'ADMIN' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-bold">{user._count.orders}</span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {openDropdown === user.id && (
                    <div className="absolute right-6 top-10 w-48 bg-white border border-gray-200 shadow-lg z-10 py-1 text-left">
                      <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                        Ubah Hak Akses
                      </div>
                      
                      {user.role === 'CUSTOMER' ? (
                        <button 
                          onClick={() => handleRoleChange(user.id, 'ADMIN')}
                          className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Shield className="w-3 h-3" /> Jadikan Admin
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRoleChange(user.id, 'CUSTOMER')}
                          className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 flex items-center gap-2"
                        >
                          <UserIcon className="w-3 h-3" /> Jadikan Customer
                        </button>
                      )}

                      <div className="border-t border-gray-100 mt-1 mb-1"></div>
                      
                      <button 
                        onClick={() => handleDelete(user.id, user._count.orders)}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus Pengguna
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
