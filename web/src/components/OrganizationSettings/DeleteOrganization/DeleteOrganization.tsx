import React, { useState } from 'react';
import { navigate, routes } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/Dialog';
import {
  Alert,
  AlertDescription,
} from 'src/components/ui/Alert';
import { Button } from 'src/components/ui/Button';
import { Input } from 'src/components/ui/Input';
import { useOrganization } from 'src/context/OrganizationContext';

const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: String!) {
    deleteOrganization(id: $id) {
      id
    }
  }
`;

const DeleteOrganization = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentOrganization, refreshOrganizations } = useOrganization();

  const [deleteOrg] = useMutation(DELETE_ORGANIZATION, {
    onCompleted: async () => {
      setLoading(false);
      await refreshOrganizations();
      toast.success('Organization deleted successfully');
      // We don't need to manually set the default organization or handle navigation
      // to personal org - the backend handles setting the default org, and the
      // OrganizationContext will handle the redirect based on the new default org
      navigate(routes.dashboard());
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
      setIsOpen(false);
      setConfirmText('');
    },
  });

  const handleDelete = async () => {
    if (confirmText !== currentOrganization?.name) {
      toast.error('Organization name does not match');
      return;
    }

    setLoading(true);
    await deleteOrg({
      variables: {
        id: currentOrganization?.id,
      },
    });
  };

  // Don't render the delete option for personal organizations
  if (currentOrganization?.type === 'PERSONAL') {
    return null;
  }

  return (
    <div className="space-y-6 border-t border-gray-700 pt-6">
      <div className="rounded-lg bg-red-950/50 p-6">
        <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        <p className="mt-2 text-sm text-gray-300">
          Once you delete an organization, there is no going back. Please be certain.
          Your personal organization cannot be deleted unless your entire user profile is deleted.
        </p>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="mt-4"
            >
              Delete Organization
            </Button>
          </DialogTrigger>

          <DialogContent className="border-gray-700 bg-gray-900 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-red-400">Delete Organization</DialogTitle>
              <DialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the
                {' '}<span className="font-semibold">{currentOrganization?.name}</span>{' '}
                organization and remove all associated data.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive" className="border-red-900/50 bg-red-950/50">
              <AlertDescription>
                Please type <span className="font-semibold">{currentOrganization?.name}</span> to confirm.
              </AlertDescription>
            </Alert>

            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-4 border-gray-700 bg-gray-800 text-gray-100"
              placeholder="Enter organization name"
            />

            <DialogFooter className="mt-6 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-100"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== currentOrganization?.name || loading}
                className="disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Organization'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteOrganization;
