// Helper functions for flow API calls
export async function createFlow(flow) {
  const response = await fetch('/api/flows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flow),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create flow');
  }
  
  return response.json();
}

export async function getFlows() {
  const response = await fetch('/api/flows');
  
  if (!response.ok) {
    throw new Error('Failed to fetch flows');
  }
  
  return response.json();
}

export async function updateFlow(id, flow) {
  const response = await fetch(`/api/flows/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flow),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update flow');
  }
  
  return response.json();
}

export async function deleteFlow(id) {
  const response = await fetch(`/api/flows/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete flow');
  }
  
  return response.json();
}

export async function getFlowLogs(id) {
  const response = await fetch(`/api/flows/${id}/logs`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch flow logs');
  }
  
  return response.json();
} 