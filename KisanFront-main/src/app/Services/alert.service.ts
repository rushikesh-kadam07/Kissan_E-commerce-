import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly green = '#198754';
  private readonly red = '#dc3545';
  private readonly amber = '#f59f00';
  private readonly blue = '#0d6efd';

  success(title: string, text = '', timer = 1800) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer,
      showConfirmButton: false,
      timerProgressBar: true,
      color: '#14532d',
      background: '#f6fff8',
      iconColor: this.green,
      customClass: {
        popup: 'rounded-4 shadow',
        title: 'fw-bold'
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      }
    });
  }

  error(title: string, text = 'Something went wrong') {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: this.red,
      color: '#7f1d1d',
      background: '#fff7f7',
      iconColor: this.red,
      customClass: {
        popup: 'rounded-4 shadow',
        confirmButton: 'px-4'
      }
    });
  }

  info(title: string, text = '', timer?: number) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      timer,
      showConfirmButton: !timer,
      confirmButtonColor: this.blue,
      color: '#1e3a8a',
      background: '#f8fbff',
      customClass: {
        popup: 'rounded-4 shadow'
      }
    });
  }

  warning(title: string, text = '') {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: this.amber,
      color: '#78350f',
      background: '#fffdf5',
      customClass: {
        popup: 'rounded-4 shadow'
      }
    });
  }

  async confirmAction(title: string, text: string, confirmButtonText = 'Yes, continue'): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: this.red,
      cancelButtonColor: '#6c757d',
      background: '#fffdf5',
      color: '#3f2a00',
      customClass: {
        popup: 'rounded-4 shadow',
        confirmButton: 'px-4',
        cancelButton: 'px-4'
      }
    });

    return result.isConfirmed;
  }

  confirmDelete(itemName = 'this record') {
    return this.confirmAction('Delete?', `Are you sure you want to delete ${itemName}?`, 'Yes, delete');
  }

  confirmCancel(itemName = 'this action') {
    return this.confirmAction('Are you sure?', `Do you want to cancel ${itemName}?`, 'Yes, cancel');
  }

  loading(title = 'Please wait...', text = 'Working on your request') {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
      background: '#ffffff',
      customClass: {
        popup: 'rounded-4 shadow'
      }
    });
  }

  close() {
    Swal.close();
  }

  toast(title: string, icon: SweetAlertIcon = 'success', timer = 2200) {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      iconColor: icon === 'success' ? this.green : undefined,
      customClass: {
        popup: 'rounded-3 shadow'
      }
    });
  }

  toastSuccess(title: string) {
    return this.toast(title, 'success');
  }

  toastError(title: string) {
    return this.toast(title, 'error');
  }

  getErrorMessage(error: any, fallback = 'Something went wrong'): string {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (typeof error.error === 'string') return error.error;
    if (error.error?.message) return error.error.message;
    if (error.message) return error.message;
    return fallback;
  }
}
