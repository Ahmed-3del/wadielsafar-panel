import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { extractErrorMessage } from '@/services/api/client'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null)
    try {
      await login(values.email, values.password)
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'
      void navigate(redirectTo, { replace: true })
    } catch (error) {
      setFormError(extractErrorMessage(error))
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
      {/* Room here for the artwork as drawn, tagline and all. */}
      <img src="/logo-full.png" alt="Wadi Al Safar" className="h-24 w-auto" />
      <h1 className="mt-4 text-lg font-semibold text-navy-900">Wadi Al Safar Admin</h1>
      <p className="mt-1 text-sm text-stone-500">Sign in to manage the panel.</p>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
        noValidate
      >
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            hasError={!!errors.email}
            {...register('email')}
          />
        </FormField>
        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            hasError={!!errors.password}
            {...register('password')}
          />
        </FormField>
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
