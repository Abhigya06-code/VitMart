<?php
namespace App\Http\Controllers;
 
use App\Models\{OtpVerification, User};
use App\Mail\OtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Hash, Mail, Validator};
use Carbon\Carbon;
 
class AuthController extends Controller
{
    // Step 1 – Register: validate data & send OTP
    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email|ends_with:@vitstudent.ac.in,@vit.ac.in',
            'password' => 'required|min:8|confirmed',
            'phone'    => 'nullable|string|max:15',
            'block'    => 'nullable|string|max:100',
            'show_phone' => 'nullable|boolean',
        ]);
 
        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }
 
        // Store pending registration in session / send OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
 
        OtpVerification::updateOrCreate(
            ['email' => $request->email],
            ['otp' => $otp, 'expires_at' => Carbon::now()->addMinutes(10)]
        );
 
        // Cache the pending user data (use cache or session; here we use cache)
        cache()->put('pending_user_' . $request->email, $request->only(
            'name', 'email', 'password', 'phone', 'block', 'show_phone'
        ), now()->addMinutes(15));
 
        Mail::to($request->email)->queue(new OtpMail($otp));
 
        return response()->json(['message' => 'OTP sent to your college email.']);
    }
 
    // Step 2 – Verify OTP → create account
    public function verifyOtp(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $record = OtpVerification::where('email', $request->email)
                                  ->where('otp', $request->otp)
                                  ->first();
 
        if (!$record)               return response()->json(['message' => 'Invalid OTP.'], 400);
        if ($record->isExpired())   return response()->json(['message' => 'OTP expired.'], 400);
 
        $pending = cache()->get('pending_user_' . $request->email);
        if (!$pending)              return response()->json(['message' => 'Registration data expired. Please register again.'], 400);
 
        $user = User::create([
            'name'       => $pending['name'],
            'email'      => $pending['email'],
            'password'   => Hash::make($pending['password']),
            'phone'      => $pending['phone'] ?? null,
            'block'      => $pending['block'] ?? null,
            'show_phone' => $pending['show_phone'] ?? false,
            'email_verified_at' => now(),
        ]);
 
        $record->delete();
        cache()->forget('pending_user_' . $request->email);
 
        $token = $user->createToken('vitmart')->plainTextToken;
 
        return response()->json(['message' => 'Account created.', 'token' => $token, 'user' => $user]);
    }
 
    // Login
    public function login(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $user = User::where('email', $request->email)->first();
 
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }
        if (!$user->email_verified_at) {
            return response()->json(['message' => 'Email not verified.'], 403);
        }
 
        $token = $user->createToken('vitmart')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }
 
    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out.']);
    }
}
 