
namespace App\Mail;
 
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
 
class OtpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
 
    public function __construct(public string $otp) {}
 
    public function envelope(): Envelope
    {
        return new Envelope(subject: 'VITMart – Your OTP Verification Code');
    }
 
    public function content(): Content
    {
        return new Content(view: 'emails.otp');
        // Create resources/views/emails/otp.blade.php (see below)
    }
}
 