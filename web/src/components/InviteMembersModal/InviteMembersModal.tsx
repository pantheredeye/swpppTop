import { useState } from 'react';
import { useMutation, useQuery } from '@redwoodjs/web';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from 'src/components/ui/Dialog';
import { Input } from 'src/components/ui/Input';
import { Button } from 'src/components/ui/Button';
import { Plus } from 'lucide-react'


const INVITE_MEMBER_MUTATION = gql`
  mutation inviteMember($organizationId: String!, $userId: String!, $roleId: String!) {
    inviteMember(organizationId: $organizationId, userId: $userId, roleId: $roleId) {
      userId
      status
    }
  }
`;

const SEARCH_USERS_QUERY = gql`
  query SearchUsers($organizationId: String!, $searchTerm: String!) {
    searchUsers(organizationId: $organizationId, searchTerm: $searchTerm) {
      id
      email
      firstName
      lastName
    }
  }
`;

const InviteMembersModal = ({ organizationId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const [inviteMember] = useMutation(INVITE_MEMBER_MUTATION, {
    onCompleted: () => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });

  const { loading, error, data, refetch } = useQuery(SEARCH_USERS_QUERY, {
    variables: { organizationId, searchTerm },
    skip: true
  });

  const handleSearch = async () => {
    if (searchTerm.length < 3) return;

    try {
      const { data } = await refetch({ organizationId, searchTerm });
      if (data && data.searchUsers) {
        setSearchResults(data.searchUsers); // Update searchResults with the fetched data
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };
  const handleInvite = async () => {
    if (!selectedMember || !selectedRole) return;
    await inviteMember({
      variables: {
        organizationId,
        memberId: selectedMember.id,
        roleId: selectedRole,
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700">
          <Plus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>Search for members to invite to your organization.</DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
        <ul>
          {searchResults.map((member) => (
            <li key={member.id} onClick={() => setSelectedMember(member)}>
              {member.firstName} {member.lastName} ({member.email})
            </li>
          ))}
        </ul>
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="">Select a role</option>
          {/* Populate with roles */}
        </select>
        <Button onClick={handleInvite}>Invite</Button>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersModal;
