import ApplicationLogo from '@/components/ApplicationLogo'
import Button from '@/components/Button'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'

import { useState } from 'react'

const Register = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const submitForm = async event => {
        event.preventDefault()

        try {
            const { user, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                // จัดการข้อผิดพลาดที่เกิดขึ้นในกรณีที่ลงทะเบียนไม่สำเร็จ
                console.error('Registration error:', error.message)
                // อาจต้องเพิ่มการจัดการข้อผิดพลาดเพิ่มเติมตามความต้องการ
            } else {
                // ลงทะเบียนสำเร็จ ทำงานตามที่คุณต้องการ เช่น นำผู้ใช้ไปยังหน้าล็อกอิน
                console.log('Registration successful:', user)
                // ทำตามที่คุณต้องการหลังจากลงทะเบียนสำเร็จ
            }
        } catch (error) {
            console.error('An error occurred during registration:', error)
            // จัดการข้อผิดพลาดที่เกิดขึ้นในกรณีที่เกิดข้อผิดพลาดในการเรียกใช้ฟังก์ชัน
        }
    }

    return (
        <GuestLayout>
            <form onSubmit={submitForm}>

                {/* Email Address */}
                <div className="mt-4">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="new-password"
                    />

                    <InputError messages={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href="/login"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        Already registered?
                    </Link>

                    <Button className="ml-4">Register</Button>
                </div>
            </form>
        </GuestLayout>
    )
}

export default Register
