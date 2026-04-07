'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Card,
  CardBody,
  Chip,
  cn
} from '@nextui-org/react';
import {
  DeleteIcon,
  EditIcon,
  PersonIcon,
  ResultIcon
} from '@/components/icons';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import React, { useState } from 'react';
import { base64url, formatId, validId } from '@/lib/helpers';
import { useRouter } from '@/navigation';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/modal';

interface CompareProps {
  addPersonText: string;
  comparePeopleText: string;
  paramId?: string;
}

export const ComparePeople = ({
  addPersonText,
  comparePeopleText,
  paramId
}: CompareProps) => {
  const router = useRouter();
  const columns = [
    {
      key: 'name',
      label: 'NAME'
    },
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'actions',
      label: 'ACTIONS'
    }
  ];

  type Row = {
    id: string;
    name: string;
  };
  const [rows, setRows] = useState<Row[]>([]);
  const [name, setName] = useState<string>('');
  const [id, setId] = useState(paramId ?? '');

  const [editName, setEditName] = useState<string>('');
  const [editId, setEditId] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isInvalidId = React.useMemo(() => {
    if (id === '') return false;

    const newId = formatId(id);
    if (rows.some((item) => item.id === newId)) return true;

    return !validId(newId);
  }, [id, rows]);

  const isInvalidEditId = React.useMemo(() => {
    if (editId === '') return false;

    const newId = formatId(editId);
    return !validId(newId);
  }, [editId]);

  function deleteItem(id: string) {
    setRows((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  }

  function addPerson() {
    const newId = formatId(id);
    if (name && id && !isInvalidId) {
      setRows((prev) => {
        return [...prev, { id: newId, name }];
      });
      setName('');
      setId('');
    }
  }

  function comparePeople() {
    const urlParam = base64url.encode(JSON.stringify(rows));
    router.push(`/compare/${urlParam}`);
  }

  function onOpenEditPerson(onOpen: () => void, item: Row) {
    setEditName(item.name);
    setEditId(item.id);
    setEditIndex(rows.findIndex(({ id }) => id === item.id));
    onOpen();
  }

  function editPerson(onClose: () => void) {
    const newId = formatId(editId);
    if (editName && editId && !isInvalidEditId && editIndex !== undefined) {
      setRows((prev) => {
        const updatedRows = [...prev];
        updatedRows[editIndex] = { id: newId, name: editName };
        return updatedRows;
      });
      setEditName('');
      setEditId('');
      setEditIndex(undefined);
      onClose();
    }
  }

  return (
    <div className='w-full flex flex-col gap-10 mt-4'>
      <Card className="glass-card border-divider/30 shadow-xl overflow-visible">
        <CardBody className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold font-display tracking-tight">Add Profile</h3>
              <p className="text-sm text-default-500">Enter a name and the Report ID from a completed test.</p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end'>
              <Input
                type='text'
                label='Name'
                variant="bordered"
                placeholder='Arthur Dent'
                radius="lg"
                startContent={
                  <PersonIcon className='text-xl text-default-400 pointer-events-none' />
                }
                value={name}
                onValueChange={setName}
                classNames={{
                  inputWrapper: "bg-default-50/50"
                }}
              />
              <Input
                type='text'
                label='Report ID'
                variant="bordered"
                placeholder='58a70606a835c... (24 chars)'
                radius="lg"
                startContent={
                  <ResultIcon className='text-xl text-default-400 pointer-events-none' />
                }
                value={id}
                onValueChange={setId}
                isInvalid={isInvalidId}
                errorMessage={isInvalidId && 'Invalid or duplicate ID'}
                classNames={{
                  inputWrapper: "bg-default-50/50"
                }}
              />
              <Button
                color='primary'
                radius="lg"
                className="h-14 px-8 font-bold shadow-lg"
                onClick={addPerson}
                isDisabled={!name || !id || isInvalidId}
              >
                {addPersonText}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-display tracking-tight uppercase tracking-[0.1em] text-default-400 flex items-center gap-2">
            Comparison List
            <Chip size="sm" variant="flat" color="primary">{rows.length}</Chip>
          </h3>
        </div>

        {rows.length === 0 ? (
          <div className="glass-card border-dashed border-divider/50 p-12 text-center flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center text-default-300">
                <PersonIcon size={32} />
             </div>
             <p className="font-bold text-default-400 italic">No profiles added yet. Add at least two to compare.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {rows.map((item, idx) => (
              <div 
                key={item.id} 
                className="glass-card p-4 flex items-center justify-between group hover:border-primary/50 transition-all animate-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-xs text-default-400 font-mono tracking-tighter opacity-70 italic">{item.id}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    isIconOnly
                    variant='light'
                    size="sm"
                    radius="full"
                    className="text-default-400 hover:text-primary transition-colors"
                    onPress={() => onOpenEditPerson(onOpen, item)}
                  >
                    <EditIcon size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    variant='light'
                    size="sm"
                    radius="full"
                    className="text-default-400 hover:text-danger transition-colors"
                    onClick={() => deleteItem(item.id)}
                  >
                    <DeleteIcon size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          size="lg"
          radius="full"
          className={cn(
            "h-16 mt-4 font-black text-xl transition-all shadow-2xl",
            rows.length >= 2 
              ? "bg-gradient-to-r from-primary to-secondary text-white scale-100" 
              : "bg-default-100 text-default-400 scale-95 opacity-50 cursor-not-allowed"
          )}
          isDisabled={rows.length < 2}
          onClick={comparePeople}
        >
          {comparePeopleText}
        </Button>
      </div>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        placement='center'
        backdrop="blur"
        classNames={{
          base: "glass-card border-divider/30",
          header: "border-b border-divider/20",
          footer: "border-t border-divider/20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='font-display font-black text-xl'>
                Edit Profile
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="flex flex-col gap-6">
                  <Input
                    type='text'
                    label='Name'
                    variant="bordered"
                    placeholder='Arthur Dent'
                    startContent={
                      <PersonIcon className='text-xl text-default-400 pointer-events-none' />
                    }
                    value={editName}
                    onValueChange={setEditName}
                  />
                  <Input
                    type='text'
                    label='Report ID'
                    variant="bordered"
                    placeholder='58a70606a835c...'
                    startContent={
                      <ResultIcon className='text-xl text-default-400 pointer-events-none' />
                    }
                    value={editId}
                    onValueChange={setEditId}
                    isInvalid={isInvalidEditId}
                    errorMessage={isInvalidEditId && 'Invalid ID format'}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant='light' radius="full" onPress={onClose} className="font-bold">
                  Cancel
                </Button>
                <Button color='primary' radius="full" className="font-bold" onPress={() => editPerson(onClose)}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
