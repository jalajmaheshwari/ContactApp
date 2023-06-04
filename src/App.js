import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState('add');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    axios.get('https://dummyjson.com/users')
      .then(response => {
        setContacts(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filterContacts = () => {
    // Filter the contacts based on the search query
    const filteredContacts = contacts.filter((contact) => {
      return (
        (contact.firstName && contact.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.phone && contact.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

    // If no contacts are found and the search query is not empty, show a message
    if (filteredContacts.length === 0 && searchQuery !== '') {
      return [{ id: 'no-results-found', firstName: 'No contacts found.' }];
    }

    // Otherwise, return the filtered contacts
    return filteredContacts;
  };

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
    setFormType('edit');
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setPhone(contact.phone);
    setModalVisible(true);
  };

  const handleAddContact = () => {
    const newContact = {
      id: Math.random().toString(),
      firstName,
      lastName,
      phone,
    };
    setContacts([...contacts, newContact]);
    setModalVisible(false);
    setFirstName('');
    setLastName('');
    setPhone('');
  };

  const handleUpdateContact = () => {
    const updatedContact = {
      ...selectedContact,
      firstName,
      lastName,
      phone,
    };
    const updatedContacts = [...contacts];
    const index = updatedContacts.findIndex(c => c.id === updatedContact.id);
    updatedContacts[index] = updatedContact;
    setContacts(updatedContacts);
    setModalVisible(false);
    setSelectedContact(null);
    setFirstName('');
    setLastName('');
    setPhone('');
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== contactId);
      setContacts(updatedContacts);
    }
  };

  const renderContactItem = (contact) => {
    return (
      <div key={contact.id} className="contact-item">
        <div>
          <div className="contact-name">{contact.firstName}</div>
          {contact.phone && <div className="contact-number">{contact.phone}</div>}
        </div>
        <div className="contact-actions">
          <button onClick={() => handleContactPress(contact)}>Update</button>
          <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
        </div>
      </div>
    );
  };

  const renderNoContacts = () => {
    if (contacts.length === 0) {
      return <div className="no-contacts">No contacts found.</div>;
    }
  };

  const renderModal = () => {
    return (
      <div className="modal" style={{ display: modalVisible ? 'block' : 'none' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{formType === 'add' ? 'Add Contact' : 'Edit Contact'}</h2>
            <span className="close" onClick={() => {
              setModalVisible(false);
              setSelectedContact(null);
              setFirstName('');
              setLastName('');
              setPhone('');
            }}>&times;</span>
          </div>
          <div className="modal-body">
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="modal-footer">
            <button onClick={() => {
              setModalVisible(false);
              setSelectedContact(null);
              setFirstName('');
              setLastName('');
              setPhone('');
            }}>Cancel</button>
            <button onClick={formType === 'add' ? handleAddContact : handleUpdateContact}>{formType === 'add' ? 'Add' : 'Update'}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Contacts</h1> 
      <div className='bar-container'>
        <div className="search-container">
          <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button className="add-contact-button" onClick={() => {
          setFormType('add');
          setModalVisible(true);
        }}>Add Contact</button>
      </div>
      <div className="contacts-container">
        {renderNoContacts()}
        {filterContacts().map(contact => renderContactItem(contact))}
      </div>
      {renderModal()}
    </div>
  );
};

export default App;