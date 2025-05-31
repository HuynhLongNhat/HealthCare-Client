/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';
import { updatePrescription } from '@/api/appointment.api';
import { toast } from 'react-toastify';

// Danh sách các loại thuốc
const medicationCategories = [
  'Viên nén',
  'Viên nang',
  'Viên sủi',
  'Sirô',
  'Thuốc tiêm',
  'Kem bôi',
  'Dung dịch',
  'Thuốc nhỏ mắt',
  'Thuốc nhỏ mũi',
  'Khác',
];

// Danh sách đơn vị tính
const medicationUnits = ['Viên', 'Lọ', 'Tuýp', 'Chai', 'Gói', 'Ống', 'Hộp', 'Vỉ'];

// Schema validation với Zod
const formSchema = z.object({
  name: z.string().min(1, 'Tên thuốc là bắt buộc'),
  category: z.string().min(1, 'Phân loại là bắt buộc'),
  unit: z.string().min(1, 'Đơn vị tính là bắt buộc'),
  quantity: z.coerce
    .number()
    .min(1, 'Số lượng phải lớn hơn 0')
    .positive('Số lượng phải là số dương'),
  instructions: z.string().optional(),
  note: z.string().optional(),
});

const EditPrescription = ({ open, handleClose, data, fetch }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      unit: '',
      quantity: 0,
      instructions: '',
      note: '',
    },
  });

  // Reset form khi data thay đổi
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.medication_name || '',
        category: data.category || '',
        unit: data.unit || '',
        quantity: data.quantity || 0,
        instructions: data.instructions || '',
        note: data.note || '',
      });
    }
  }, [data, form]);

  const handleFormSubmit =async (values) => {
    try {
      const res = await updatePrescription(data.id, values)
      if (res.EC === 0) {
        toast.success(res.EM)
        handleClose()
        fetch()
      }
    } catch (error) {
      toast.error(error.message)
    }
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">
            Chỉnh sửa thuốc
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tên thuốc */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên thuốc <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập tên thuốc"
                        className="border-slate-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phân loại */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phân loại <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Chọn phân loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medicationCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Đơn vị tính */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Đơn vị tính <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Chọn đơn vị" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medicationUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Số lượng */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số lượng <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="Nhập số lượng"
                        className="border-slate-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hướng dẫn sử dụng */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hướng dẫn sử dụng</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập hướng dẫn sử dụng chi tiết"
                      rows={3}
                      className="border-slate-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ghi chú */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập ghi chú (nếu có)"
                      rows={2}
                      className="border-slate-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                className="w-full sm:w-auto flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrescription;