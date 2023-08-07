import { Ref } from 'react';

interface EventModalProps {
  dialogRef: Ref<HTMLDialogElement>;
}

export const EventModal = ({ dialogRef }: EventModalProps) => {
  return (
    <dialog ref={dialogRef}>
      <form>
        <input
          type="date"
          id="start-date"
          defaultValue="2023-06-08"
          min="1999-06-02"
        />
        <input type="time" id="start-time" defaultValue="12:00" />
      </form>
    </dialog>
  );
};
