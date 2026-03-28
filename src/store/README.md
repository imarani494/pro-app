# Redux Store Setup

This directory contains the Redux store configuration for the application.

## Structure

```
src/store/
├── store.ts          # Main store configuration
├── hooks.ts          # Typed Redux hooks
├── index.ts          # Public exports
└── slices/
    └── appSlice.ts   # Example app slice
```

## Usage

### Using Redux in Components

```typescript
import React from 'react';
import {View, Button} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store';
import {setLoading, setUser, clearError} from '../store';

function MyComponent() {
  // Get typed hooks
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.app.isLoading);
  const user = useAppSelector(state => state.app.user);
  const error = useAppSelector(state => state.app.error);

  // Dispatch actions
  const handleLogin = () => {
    dispatch(setLoading(true));
    // ... perform login
    dispatch(setUser({id: '1', name: 'John', email: 'john@example.com'}));
    dispatch(setLoading(false));
  };

  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      {user && <Text>Welcome, {user.name}!</Text>}
      {error && <Text>Error: {error}</Text>}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
```

### Creating New Slices

1. Create a new file in `slices/` directory:

```typescript
// src/store/slices/userSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  // Your state shape
}

const initialState: UserState = {
  // Initial values
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Your reducers
  },
});

export const {
  /* actions */
} = userSlice.actions;
export default userSlice.reducer;
```

2. Add the reducer to `store.ts`:

```typescript
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer, // Add here
  },
});
```

## Available Actions (from appSlice)

- `setLoading(boolean)` - Set loading state
- `setUser(user | null)` - Set user data
- `setError(string | null)` - Set error message
- `clearError()` - Clear error
- `resetApp()` - Reset all app state

## TypeScript Support

All hooks and actions are fully typed. Use `useAppDispatch` and `useAppSelector` instead of the plain Redux hooks for better TypeScript support.
