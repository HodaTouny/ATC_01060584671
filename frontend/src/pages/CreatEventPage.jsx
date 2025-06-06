import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import eventsService from '../services/eventService';
import EventForm from '../components/eventForm/EventForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { showSuccessToast, showErrorToast } from '../components/common/ToastAlert';
import { useAuth } from '../contexts/AuthContext';

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: eventsService.createEvent,
    onSuccess: async () => {
  showSuccessToast('Event created successfully');

  await queryClient.invalidateQueries({
    predicate: (query) => query.queryKey[0] === 'events',
  });

  await new Promise((res) => setTimeout(res, 200));

  await queryClient.refetchQueries({
    predicate: (query) => query.queryKey[0] === 'events',
  });

  navigate('/');
}
,
    onError: (error) => {
      console.error(error);
      showErrorToast('Failed to create event');
    },
  });

  const handleCreate = (formData) => {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }
    data.append('created_by', user.user_id);

    mutation.mutate(data);
  };

  if (mutation.isLoading) return <LoadingSpinner />;

  return (
    <div className="container py-5">
      <EventForm mode="create" onSubmit={handleCreate} />
    </div>
  );
};

export default CreateEventPage;
