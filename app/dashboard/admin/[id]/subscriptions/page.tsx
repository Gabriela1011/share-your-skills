"use client"
import { useEffect, useState } from "react"
import { Subscription } from "./types"
import SubscriptionForm from "./SubscriptionForm";
import { Button } from "@/components/ui/button";
import SubscriptionCard from "./SubscriptionCard";
import Spinner from "@/components/myComponents/Spinner";

export default function ManageSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/subscriptions')
      .then(res => res.json())
      .then(data => {
        setSubscriptions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch", err);
        setLoading(false);
      });
  }, []);

  if(loading) return <Spinner />
  
  const sortedSubscriptions = [...subscriptions].sort((a, b) => a.price - b.price);

  console.log("subscr", subscriptions)

  const handleAdd = (newSub: Subscription) => {
    setSubscriptions((prev) => [...prev, newSub]);
    setShowForm(false);
  }

  const handleUpdate = (newSub: Subscription) => {
    setSubscriptions((prev) => 
        prev.map(s => 
          (s.id === newSub.id ?
            { ...newSub, subscription_features: s.subscription_features } 
            : s))
    );
    setEditingSubscription(null);
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this subscription?");
    if(!confirmed) return;

    try{
        const res = await fetch(`/api/subscriptions/${id}`, {
          method: 'DELETE',
        });

      if (res.ok) {
        setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      } else {
        console.error("Error deleting subscription")
      }
    } catch (error) {
      console.error("Error - fetch subscriptions", error);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Subscriptions</h1>

      {showForm ? (
        <SubscriptionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)}/>
      ) : (
        <button onClick={() => setShowForm(true)} className="bg-white shadow-md p-2 mb-10 rounded-lg flex items-center gap-1 text-blue-400 hover:text-indigo-400">
           Add New Subscription
        </button>
      )}

      {sortedSubscriptions.map((sub) => 
        editingSubscription?.id === sub.id ? (
          <SubscriptionForm 
            key={sub.id}
            initialData={sub}
            onSubmit={handleUpdate}
            onCancel={() => setEditingSubscription(null)}
          />
        ) : (
          <SubscriptionCard 
            key={sub.id}
            sub={sub}
            onEdit={() => setEditingSubscription(sub)}
            onDelete={() => handleDelete(sub.id)}
          />
        )
      )}
    </div>
  );
}


//   return <div>manage subscriptios
//     <p>modifica abonamente</p>
//     <p>adauga abonament</p>
//     <p>sterge abonament</p>
//     <p>vizualizwaza abonamentele profesorilor</p>
//   </div>;

