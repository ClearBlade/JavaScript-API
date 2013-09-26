//
//  NSURLRequest+AllowUntrustedCertificates.m
//  ClearConcert
//
//  Created by Andy Joslin on 3/15/13.
//
//

#import "NSURLRequest+AllowUntrustedCertificates.h"
@interface NSURLRequest(AllowUntrustedCertificates_hidden)
+(bool)getAllowAllRequests;
@end
@implementation NSURLRequest (AllowUntrustedCertificates)
static bool _allowRequests = false;

+(void)setAllowAllRequests:(BOOL)allowRequests
{
    _allowRequests = allowRequests;
}
+(bool)getAllowAllRequests
{
    return _allowRequests;
}

+ (BOOL)allowsAnyHTTPSCertificateForHost:(NSString *)host
{
    return [NSURLRequest getAllowAllRequests];
}

@end

